export const IDL = {
    "version": "0.1.0",
    "name": "sol_tip_lottery",
    "instructions": [
        {
            "name": "initialize",
            "accounts": [
                { "name": "global", "isMut": true, "isSigner": false },
                { "name": "epoch", "isMut": true, "isSigner": false },
                { "name": "authority", "isMut": true, "isSigner": true },
                { "name": "treasury", "isMut": true, "isSigner": false },
                { "name": "prizeVault", "isMut": true, "isSigner": false },
                { "name": "systemProgram", "isMut": false, "isSigner": false }
            ],
            "args": []
        },
        {
            "name": "tip",
            "accounts": [
                { "name": "user", "isMut": true, "isSigner": true },
                { "name": "treasury", "isMut": true, "isSigner": false },
                { "name": "prizeVault", "isMut": true, "isSigner": false },
                { "name": "epoch", "isMut": true, "isSigner": false },
                { "name": "participant", "isMut": true, "isSigner": false },
                { "name": "systemProgram", "isMut": false, "isSigner": false }
            ],
            "args": [
                { "name": "amount", "type": "u64" }
            ]
        },
        {
            "name": "closeEpoch",
            "accounts": [
                { "name": "epoch", "isMut": true, "isSigner": false }
            ],
            "args": []
        },
        {
            "name": "finalizeDraw",
            "accounts": [
                { "name": "epoch", "isMut": true, "isSigner": false },
                { "name": "prizeVault", "isMut": true, "isSigner": false },
                { "name": "winner", "isMut": true, "isSigner": false }
            ],
            "args": [
                { "name": "randomness", "type": "u64" }
            ]
        }
    ],
    "accounts": [
        {
            "name": "GlobalState",
            "type": {
                "kind": "struct",
                "fields": [
                    { "name": "authority", "type": "publicKey" },
                    { "name": "treasury", "type": "publicKey" },
                    { "name": "prizeVault", "type": "publicKey" },
                    { "name": "currentEpoch", "type": "u64" }
                ]
            }
        },
        {
            "name": "EpochState",
            "type": {
                "kind": "struct",
                "fields": [
                    { "name": "epochId", "type": "u64" },
                    { "name": "startTime", "type": "i64" },
                    { "name": "endTime", "type": "i64" },
                    { "name": "totalEntries", "type": "u64" },
                    { "name": "prizePool", "type": "u64" },
                    { "name": "isClosed", "type": "bool" },
                    { "name": "winner", "type": { "option": "publicKey" } }
                ]
            }
        },
        {
            "name": "Participant",
            "type": {
                "kind": "struct",
                "fields": [
                    { "name": "user", "type": "publicKey" },
                    { "name": "epochId", "type": "u64" },
                    { "name": "entries", "type": "u64" }
                ]
            }
        }
    ],
    "errors": [
        { "code": 6000, "name": "EpochClosed", "msg": "Epoch already closed" },
        { "code": 6001, "name": "EpochStillRunning", "msg": "Epoch still running" },
        { "code": 6002, "name": "NoEntries", "msg": "No entries in this epoch" },
        { "code": 6003, "name": "WinnerAlreadySelected", "msg": "Winner already selected" }
    ]
} as const;

export const PROGRAM_ID = "FqUyWR1VRDbsepJE1cayAqLcdp1WuMqPKjLgbkP24ruB";

