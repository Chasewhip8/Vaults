export type ExampleStakeAdapter = {
  "version": "0.1.0",
  "name": "example_stake_adapter",
  "instructions": [
    {
      "name": "deposit",
      "docs": [
        "Instruction to handle deposits from the vaults program, the vaults program has no idea what this program does",
        "except for it's return value.",
        "",
        "# Arguments",
        "",
        "* `ctx`: Instruction Context",
        "* `amount`: The adapter adjusted deposit amount, aka total_deposit * ratio",
        "",
        "returns: Result<u64, Error>, where the u64 is the providers updated balance used to calculate minted receipt assets"
      ],
      "accounts": [
        {
          "name": "restricted",
          "accounts": [
            {
              "name": "ensureVaultsSigned",
              "isMut": false,
              "isSigner": true
            }
          ]
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "stakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "adapter",
          "isMut": false,
          "isSigner": false,
          "relations": [
            "stake_account"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ],
      "returns": "u64"
    },
    {
      "name": "redeem",
      "docs": [
        "Instruction to handle redemptions from the vaults program, the vaults program has no idea what this program does",
        "",
        "# Arguments",
        "",
        "* `ctx`: Instruction Context",
        "* `amount`: The adapter adjusted redeem amount",
        "",
        "returns: Result<(), Error>"
      ],
      "accounts": [
        {
          "name": "restricted",
          "accounts": [
            {
              "name": "ensureVaultsSigned",
              "isMut": false,
              "isSigner": true
            }
          ]
        },
        {
          "name": "stakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "adapter",
          "isMut": false,
          "isSigner": false,
          "relations": [
            "stake_account"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "crank",
      "docs": [
        "Instruction to crank and return the providers balance.",
        "",
        "returns: Result<u64, Error>, where the u64 is the providers updated balance used to calculate minted receipt assets"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [],
      "returns": "u64"
    },
    {
      "name": "editPhase",
      "docs": [
        "Transitions the adapter into a new phase",
        "",
        "returns: Result<u64, Error>, the new Phase"
      ],
      "accounts": [
        {
          "name": "restricted",
          "accounts": [
            {
              "name": "ensureVaultsSigned",
              "isMut": false,
              "isSigner": true
            }
          ]
        },
        {
          "name": "adapter",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newPhase",
          "type": {
            "defined": "Phase"
          }
        }
      ],
      "returns": {
        "defined": "Phase"
      }
    },
    {
      "name": "initialize",
      "docs": [
        "Instruction to initialize the provider for a vault.",
        "",
        "returns: Result<(), Error>"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "iMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakeAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "Stake"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "i_mint"
              }
            ]
          }
        },
        {
          "name": "baseMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "adapter",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "Adapter"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "i_mint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "adapter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakeAccount",
            "type": "publicKey"
          },
          {
            "name": "internalPhase",
            "type": {
              "defined": "Phase"
            }
          },
          {
            "name": "baseMint",
            "type": "publicKey"
          },
          {
            "name": "iMint",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Phase",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "PendingActive"
          },
          {
            "name": "Active"
          },
          {
            "name": "PendingExpired"
          },
          {
            "name": "Expired"
          }
        ]
      }
    }
  ]
};

export const IDL: ExampleStakeAdapter = {
  "version": "0.1.0",
  "name": "example_stake_adapter",
  "instructions": [
    {
      "name": "deposit",
      "docs": [
        "Instruction to handle deposits from the vaults program, the vaults program has no idea what this program does",
        "except for it's return value.",
        "",
        "# Arguments",
        "",
        "* `ctx`: Instruction Context",
        "* `amount`: The adapter adjusted deposit amount, aka total_deposit * ratio",
        "",
        "returns: Result<u64, Error>, where the u64 is the providers updated balance used to calculate minted receipt assets"
      ],
      "accounts": [
        {
          "name": "restricted",
          "accounts": [
            {
              "name": "ensureVaultsSigned",
              "isMut": false,
              "isSigner": true
            }
          ]
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "stakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "adapter",
          "isMut": false,
          "isSigner": false,
          "relations": [
            "stake_account"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ],
      "returns": "u64"
    },
    {
      "name": "redeem",
      "docs": [
        "Instruction to handle redemptions from the vaults program, the vaults program has no idea what this program does",
        "",
        "# Arguments",
        "",
        "* `ctx`: Instruction Context",
        "* `amount`: The adapter adjusted redeem amount",
        "",
        "returns: Result<(), Error>"
      ],
      "accounts": [
        {
          "name": "restricted",
          "accounts": [
            {
              "name": "ensureVaultsSigned",
              "isMut": false,
              "isSigner": true
            }
          ]
        },
        {
          "name": "stakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "adapter",
          "isMut": false,
          "isSigner": false,
          "relations": [
            "stake_account"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "crank",
      "docs": [
        "Instruction to crank and return the providers balance.",
        "",
        "returns: Result<u64, Error>, where the u64 is the providers updated balance used to calculate minted receipt assets"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [],
      "returns": "u64"
    },
    {
      "name": "editPhase",
      "docs": [
        "Transitions the adapter into a new phase",
        "",
        "returns: Result<u64, Error>, the new Phase"
      ],
      "accounts": [
        {
          "name": "restricted",
          "accounts": [
            {
              "name": "ensureVaultsSigned",
              "isMut": false,
              "isSigner": true
            }
          ]
        },
        {
          "name": "adapter",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newPhase",
          "type": {
            "defined": "Phase"
          }
        }
      ],
      "returns": {
        "defined": "Phase"
      }
    },
    {
      "name": "initialize",
      "docs": [
        "Instruction to initialize the provider for a vault.",
        "",
        "returns: Result<(), Error>"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "iMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakeAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "Stake"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "i_mint"
              }
            ]
          }
        },
        {
          "name": "baseMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "adapter",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "Adapter"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "i_mint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "adapter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakeAccount",
            "type": "publicKey"
          },
          {
            "name": "internalPhase",
            "type": {
              "defined": "Phase"
            }
          },
          {
            "name": "baseMint",
            "type": "publicKey"
          },
          {
            "name": "iMint",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Phase",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "PendingActive"
          },
          {
            "name": "Active"
          },
          {
            "name": "PendingExpired"
          },
          {
            "name": "Expired"
          }
        ]
      }
    }
  ]
};
