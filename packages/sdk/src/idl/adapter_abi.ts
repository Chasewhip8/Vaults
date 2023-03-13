export type AdapterAbi = {
  "version": "0.1.0",
  "name": "adapter_abi",
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
          "name": "ensureVaultsSigned",
          "isMut": false,
          "isSigner": true
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
          "name": "ensureVaultsSigned",
          "isMut": false,
          "isSigner": true
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
          "name": "ensureVaultsSigned",
          "isMut": false,
          "isSigner": true
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
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "iMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": "u64"
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

export const IDL: AdapterAbi = {
  "version": "0.1.0",
  "name": "adapter_abi",
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
          "name": "ensureVaultsSigned",
          "isMut": false,
          "isSigner": true
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
          "name": "ensureVaultsSigned",
          "isMut": false,
          "isSigner": true
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
          "name": "ensureVaultsSigned",
          "isMut": false,
          "isSigner": true
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
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "iMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": "u64"
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
