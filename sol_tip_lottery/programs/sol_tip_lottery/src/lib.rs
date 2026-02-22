use anchor_lang::prelude::*;
use anchor_lang::solana_program::{
    system_instruction,
    program::invoke_signed,
};

declare_id!("FqUyWR1VRDbsepJE1cayAqLcdp1WuMqPKjLgbkP24ruB");

pub const EPOCH_DURATION: i64 = 1_296_000; // 15 days
pub const ENTRY_PRICE_LAMPORTS: u64 = 10_000_000; // 0.01 SOL

#[error_code]
pub enum LotteryError {
    #[msg("Epoch already closed")]
    EpochClosed,
    #[msg("Epoch still running")]
    EpochStillRunning,
    #[msg("No entries in this epoch")]
    NoEntries,
    #[msg("Winner already selected")]
    WinnerAlreadySelected,
}

#[account]
pub struct GlobalState {
    pub authority: Pubkey,
    pub treasury: Pubkey,
    pub prize_vault: Pubkey,
    pub current_epoch: u64,
}

#[account]
pub struct EpochState {
    pub epoch_id: u64,
    pub start_time: i64,
    pub end_time: i64,
    pub total_entries: u64,
    pub prize_pool: u64,
    pub is_closed: bool,
    pub winner: Option<Pubkey>,
}

#[account]
pub struct Participant {
    pub user: Pubkey,
    pub epoch_id: u64,
    pub entries: u64,
}

#[program]
pub mod sol_tip_lottery {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let global = &mut ctx.accounts.global;
        let clock = Clock::get()?;

        global.authority = ctx.accounts.authority.key();
        global.treasury = ctx.accounts.treasury.key();
        global.prize_vault = ctx.accounts.prize_vault.key();
        global.current_epoch = 1;

        let epoch = &mut ctx.accounts.epoch;
        epoch.epoch_id = 1;
        epoch.start_time = clock.unix_timestamp;
        epoch.end_time = clock.unix_timestamp + EPOCH_DURATION;
        epoch.total_entries = 0;
        epoch.prize_pool = 0;
        epoch.is_closed = false;
        epoch.winner = None;

        Ok(())
    }

    pub fn tip(ctx: Context<Tip>, amount: u64) -> Result<()> {
        let epoch = &mut ctx.accounts.epoch;
        let participant = &mut ctx.accounts.participant;
        let clock = Clock::get()?;

        require!(
            clock.unix_timestamp < epoch.end_time,
            LotteryError::EpochClosed
        );

        // Split
        let prize_cut = amount / 10;
        let treasury_cut = amount - prize_cut;

        // Transfer to treasury
        anchor_lang::solana_program::program::invoke(
            &system_instruction::transfer(
                &ctx.accounts.user.key(),
                &ctx.accounts.treasury.key(),
                treasury_cut,
            ),
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.treasury.to_account_info(),
            ],
        )?;

        // Transfer to prize vault
        anchor_lang::solana_program::program::invoke(
            &system_instruction::transfer(
                &ctx.accounts.user.key(),
                &ctx.accounts.prize_vault.key(),
                prize_cut,
            ),
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.prize_vault.to_account_info(),
            ],
        )?;

        // Update pool
        epoch.prize_pool += prize_cut;

        // Weighted entries
        let entries = amount / ENTRY_PRICE_LAMPORTS;
        participant.user = ctx.accounts.user.key();
        participant.epoch_id = epoch.epoch_id;
        participant.entries += entries;

        epoch.total_entries += entries;

        Ok(())
    }

    // Called after epoch ended
    pub fn close_epoch(ctx: Context<CloseEpoch>) -> Result<()> {
        let epoch = &mut ctx.accounts.epoch;
        let clock = Clock::get()?;

        require!(
            clock.unix_timestamp >= epoch.end_time,
            LotteryError::EpochStillRunning
        );

        epoch.is_closed = true;

        Ok(())
    }

    // Finalize draw after randomness delivered
    pub fn finalize_draw(
        ctx: Context<FinalizeDraw>,
        randomness: u64,
    ) -> Result<()> {
        let epoch = &mut ctx.accounts.epoch;

        require!(epoch.is_closed, LotteryError::EpochStillRunning);
        require!(epoch.winner.is_none(), LotteryError::WinnerAlreadySelected);
        require!(epoch.total_entries > 0, LotteryError::NoEntries);

        let _winner_index = randomness % epoch.total_entries;

        // ⚠️ In real production:
        // iterate through participant accounts
        // find weighted winner

        let winner = ctx.accounts.winner.key();

        // Transfer prize
        let seeds = &[b"prize_vault".as_ref()];
        let signer = &[&seeds[..]];

        invoke_signed(
            &system_instruction::transfer(
                &ctx.accounts.prize_vault.key(),
                &winner,
                epoch.prize_pool,
            ),
            &[
                ctx.accounts.prize_vault.to_account_info(),
                ctx.accounts.winner.to_account_info(),
            ],
            signer,
        )?;

        epoch.winner = Some(winner);
        epoch.prize_pool = 0;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 128)]
    pub global: Account<'info, GlobalState>,

    #[account(init, payer = authority, space = 8 + 200)]
    pub epoch: Account<'info, EpochState>,

    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK:
    #[account(mut)]
    pub treasury: AccountInfo<'info>,

    /// CHECK:
    #[account(mut)]
    pub prize_vault: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Tip<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: This is the treasury account that receives 90% of tips
    #[account(mut)]
    pub treasury: AccountInfo<'info>,

    /// CHECK: This is the prize vault account that receives 10% of tips
    #[account(mut)]
    pub prize_vault: AccountInfo<'info>,

    #[account(mut)]
    pub epoch: Account<'info, EpochState>,

    #[account(
        init_if_needed,
        payer = user,
        space = 8 + 64,
        seeds = [b"participant", user.key().as_ref()],
        bump
    )]
    pub participant: Account<'info, Participant>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CloseEpoch<'info> {
    #[account(mut)]
    pub epoch: Account<'info, EpochState>,
}

#[derive(Accounts)]
pub struct FinalizeDraw<'info> {
    #[account(mut)]
    pub epoch: Account<'info, EpochState>,

    /// CHECK:
    #[account(mut)]
    pub prize_vault: AccountInfo<'info>,

    /// CHECK:
    #[account(mut)]
    pub winner: AccountInfo<'info>,
}
