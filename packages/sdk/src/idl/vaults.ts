export type Vaults = {
  "version": "0.1.0",
  "name": "vaults",
  "instructions": [
    {
      "name": "initGroup",
      "accounts": [
        {
          "name": "vaultAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "group",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "Group"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "j_mint"
              }
            ]
          }
        },
        {
          "name": "jMint",
          "isMut": true,
          "isSigner": true
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
      "args": [
        {
          "name": "decimals",
          "type": "u8"
        }
      ]
    },
    {
      "name": "editGroup",
      "accounts": [
        {
          "name": "vaultAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "group",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "maybeNewEntries",
          "type": {
            "option": {
              "vec": {
                "defined": "AdapterEntry"
              }
            }
          }
        }
      ]
    },
    {
      "name": "initVault",
      "accounts": [
        {
          "name": "vaultAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "group",
          "isMut": true,
          "isSigner": false,
          "relations": [
            "j_mint"
          ]
        },
        {
          "name": "iMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "jMint",
          "isMut": false,
          "isSigner": false
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
      "args": [
        {
          "name": "startTimestamp",
          "type": "i64"
        },
        {
          "name": "endTimestamp",
          "type": "i64"
        },
        {
          "name": "fp32FeeRate",
          "type": "u64"
        }
      ]
    },
    {
      "name": "editVault",
      "accounts": [
        {
          "name": "vaultAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "group",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultIndex",
          "type": "u8"
        },
        {
          "name": "newStartTimestamp",
          "type": {
            "option": "i64"
          }
        },
        {
          "name": "newEndTimestamp",
          "type": {
            "option": "i64"
          }
        }
      ]
    },
    {
      "name": "deposit",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "group",
          "isMut": false,
          "isSigner": false,
          "relations": [
            "j_mint"
          ]
        },
        {
          "name": "jMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "jAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "iMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "iAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultIndex",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "adapterAccounts",
          "type": {
            "vec": "bytes"
          }
        }
      ]
    },
    {
      "name": "redeem",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "group",
          "isMut": false,
          "isSigner": false,
          "relations": [
            "j_mint"
          ]
        },
        {
          "name": "jMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "jAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "iMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "iAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultIndex",
          "type": "u8"
        },
        {
          "name": "amountI",
          "type": "u64"
        },
        {
          "name": "amountJ",
          "type": "u64"
        },
        {
          "name": "crankAdapterAccounts",
          "type": {
            "vec": "bytes"
          }
        },
        {
          "name": "redeemAdapterAccounts",
          "type": {
            "vec": "bytes"
          }
        }
      ]
    },
    {
      "name": "crank",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "group",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultIndex",
          "type": "u8"
        },
        {
          "name": "editPhaseAdapterAccounts",
          "type": {
            "vec": "bytes"
          }
        },
        {
          "name": "crankAdapterAccounts",
          "type": {
            "vec": "bytes"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "group",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "jMint",
            "type": "publicKey"
          },
          {
            "name": "adapterInfos",
            "type": {
              "vec": {
                "defined": "AdapterEntry"
              }
            }
          },
          {
            "name": "vaults",
            "type": {
              "vec": {
                "defined": "Vault"
              }
            }
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
      "name": "Vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "iMint",
            "type": "publicKey"
          },
          {
            "name": "phase",
            "type": {
              "defined": "VaultPhase"
            }
          },
          {
            "name": "jBalance",
            "type": "u64"
          },
          {
            "name": "startTimestamp",
            "type": "i64"
          },
          {
            "name": "endTimestamp",
            "type": "i64"
          },
          {
            "name": "adaptersVerified",
            "type": "bool"
          },
          {
            "name": "fp32FeeRate",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "AdapterEntry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "adapter",
            "type": "publicKey"
          },
          {
            "name": "ratioFp32",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "VaultPhase",
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
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AdapterCPIFail",
      "msg": "Error executing CPI for adapter!"
    }
  ]
};

export const IDL: Vaults = {
  "version": "0.1.0",
  "name": "vaults",
  "instructions": [
    {
      "name": "initGroup",
      "accounts": [
        {
          "name": "vaultAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "group",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "Group"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "j_mint"
              }
            ]
          }
        },
        {
          "name": "jMint",
          "isMut": true,
          "isSigner": true
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
      "args": [
        {
          "name": "decimals",
          "type": "u8"
        }
      ]
    },
    {
      "name": "editGroup",
      "accounts": [
        {
          "name": "vaultAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "group",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "maybeNewEntries",
          "type": {
            "option": {
              "vec": {
                "defined": "AdapterEntry"
              }
            }
          }
        }
      ]
    },
    {
      "name": "initVault",
      "accounts": [
        {
          "name": "vaultAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "group",
          "isMut": true,
          "isSigner": false,
          "relations": [
            "j_mint"
          ]
        },
        {
          "name": "iMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "jMint",
          "isMut": false,
          "isSigner": false
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
      "args": [
        {
          "name": "startTimestamp",
          "type": "i64"
        },
        {
          "name": "endTimestamp",
          "type": "i64"
        },
        {
          "name": "fp32FeeRate",
          "type": "u64"
        }
      ]
    },
    {
      "name": "editVault",
      "accounts": [
        {
          "name": "vaultAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "group",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultIndex",
          "type": "u8"
        },
        {
          "name": "newStartTimestamp",
          "type": {
            "option": "i64"
          }
        },
        {
          "name": "newEndTimestamp",
          "type": {
            "option": "i64"
          }
        }
      ]
    },
    {
      "name": "deposit",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "group",
          "isMut": false,
          "isSigner": false,
          "relations": [
            "j_mint"
          ]
        },
        {
          "name": "jMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "jAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "iMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "iAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultIndex",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "adapterAccounts",
          "type": {
            "vec": "bytes"
          }
        }
      ]
    },
    {
      "name": "redeem",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "group",
          "isMut": false,
          "isSigner": false,
          "relations": [
            "j_mint"
          ]
        },
        {
          "name": "jMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "jAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "iMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "iAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultIndex",
          "type": "u8"
        },
        {
          "name": "amountI",
          "type": "u64"
        },
        {
          "name": "amountJ",
          "type": "u64"
        },
        {
          "name": "crankAdapterAccounts",
          "type": {
            "vec": "bytes"
          }
        },
        {
          "name": "redeemAdapterAccounts",
          "type": {
            "vec": "bytes"
          }
        }
      ]
    },
    {
      "name": "crank",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "group",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultIndex",
          "type": "u8"
        },
        {
          "name": "editPhaseAdapterAccounts",
          "type": {
            "vec": "bytes"
          }
        },
        {
          "name": "crankAdapterAccounts",
          "type": {
            "vec": "bytes"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "group",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "jMint",
            "type": "publicKey"
          },
          {
            "name": "adapterInfos",
            "type": {
              "vec": {
                "defined": "AdapterEntry"
              }
            }
          },
          {
            "name": "vaults",
            "type": {
              "vec": {
                "defined": "Vault"
              }
            }
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
      "name": "Vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "iMint",
            "type": "publicKey"
          },
          {
            "name": "phase",
            "type": {
              "defined": "VaultPhase"
            }
          },
          {
            "name": "jBalance",
            "type": "u64"
          },
          {
            "name": "startTimestamp",
            "type": "i64"
          },
          {
            "name": "endTimestamp",
            "type": "i64"
          },
          {
            "name": "adaptersVerified",
            "type": "bool"
          },
          {
            "name": "fp32FeeRate",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "AdapterEntry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "adapter",
            "type": "publicKey"
          },
          {
            "name": "ratioFp32",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "VaultPhase",
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
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AdapterCPIFail",
      "msg": "Error executing CPI for adapter!"
    }
  ]
};
