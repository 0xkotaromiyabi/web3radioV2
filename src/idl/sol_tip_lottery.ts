export const IDL = {
    "address": "FqUyWR1VRDbsepJE1cayAqLcdp1WuMqPKjLgbkP24ruB",
    "metadata": {
        "name": "sol_tip_lottery",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
    },
    "instructions": [
        {
            "name": "close_epoch",
            "discriminator": [13, 87, 7, 133, 109, 14, 83, 25],
            "accounts": [
                {
                    "name": "epoch",
                    "writable": true
                }
            ],
            "args": []
        },
        {
            "name": "finalize_draw",
            "discriminator": [112, 9, 234, 94, 99, 176, 12, 181],
            "accounts": [
                {
                    "name": "epoch",
                    "writable": true
                },
                {
                    "name": "prize_vault",
                    "writable": true
                },
                {
                    "name": "winner",
                    "writable": true
                }
            ],
            "args": [
                {
                    "name": "randomness",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "initialize",
            "discriminator": [175, 175, 109, 31, 13, 152, 155, 237],
            "accounts": [
                {
                    "name": "global",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "epoch",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "authority",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "treasury",
                    "writable": true
                },
                {
                    "name": "prize_vault",
                    "writable": true
                },
                {
                    "name": "system_program",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": []
        },
        {
            "name": "tip",
            "discriminator": [77, 164, 35, 21, 36, 121, 213, 51],
            "accounts": [
                {
                    "name": "user",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "treasury",
                    "writable": true
                },
                {
                    "name": "prize_vault",
                    "writable": true
                },
                {
                    "name": "epoch",
                    "writable": true
                },
                {
                    "name": "participant",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [112, 97, 114, 116, 105, 99, 105, 112, 97, 110, 116]
                            },
                            {
                                "kind": "account",
                                "path": "user"
                            }
                        ]
                    }
                },
                {
                    "name": "system_program",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "EpochState",
            "discriminator": [191, 63, 139, 237, 144, 12, 223, 210]
        },
        {
            "name": "GlobalState",
            "discriminator": [163, 46, 74, 168, 216, 123, 133, 98]
        },
        {
            "name": "Participant",
            "discriminator": [32, 142, 108, 79, 211, 179, 54, 6]
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "EpochClosed",
            "msg": "Epoch already closed"
        },
        {
            "code": 6001,
            "name": "EpochStillRunning",
            "msg": "Epoch still running"
        },
        {
            "code": 6002,
            "name": "NoEntries",
            "msg": "No entries in this epoch"
        },
        {
            "code": 6003,
            "name": "WinnerAlreadySelected",
            "msg": "Winner already selected"
        }
    ],
    "types": [
        {
            "name": "EpochState",
            "type": {
                "kind": "struct",
                "fields": [
                    { "name": "epoch_id", "type": "u64" },
                    { "name": "start_time", "type": "i64" },
                    { "name": "end_time", "type": "i64" },
                    { "name": "total_entries", "type": "u64" },
                    { "name": "prize_pool", "type": "u64" },
                    { "name": "is_closed", "type": "bool" },
                    { "name": "winner", "type": { "option": "pubkey" } }
                ]
            }
        },
        {
            "name": "GlobalState",
            "type": {
                "kind": "struct",
                "fields": [
                    { "name": "authority", "type": "pubkey" },
                    { "name": "treasury", "type": "pubkey" },
                    { "name": "prize_vault", "type": "pubkey" },
                    { "name": "current_epoch", "type": "u64" }
                ]
            }
        },
        {
            "name": "Participant",
            "type": {
                "kind": "struct",
                "fields": [
                    { "name": "user", "type": "pubkey" },
                    { "name": "epoch_id", "type": "u64" },
                    { "name": "entries", "type": "u64" }
                ]
            }
        }
    ]
} as const;

export const PROGRAM_ID = "FqUyWR1VRDbsepJE1cayAqLcdp1WuMqPKjLgbkP24ruB";
