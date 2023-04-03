import { XMarkIcon } from "@heroicons/react/20/solid";
import { useMemo, useState } from "react";
import Badge from "./Badge";
import Input from "./Input";
import Modal from "./Modal";
import PaddedIcon from "./PaddedIcon";
import VaultInput from "./VaultInput";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { SeagullVaultsProvider } from "@seagullfinance/seagull";
import { PublicKey } from "@solana/web3.js";
import { AnchorProvider } from "@project-serum/anchor";
import BN from "bn.js";

type DepositProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const assetRatio = .35

const DepositModal = (props: DepositProps) => {
  const [asset1DepositAmount, setAsset1DepositAmount] = useState("0.00");
  const asset2DepositAmount = (parseFloat(asset1DepositAmount) / assetRatio).toFixed(2)
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const sdk = useMemo(() => {
    if (!wallet) {
      return;
    }

    return new SeagullVaultsProvider(
        connection,
        new PublicKey("GFBxbpxbQgnEst4ABx35rV4uW5oTbp85wpPagz39cUgd"),
        new AnchorProvider(connection, wallet, { commitment: "confirmed" })
    );
  }, [connection, wallet]);

  return (
      <Modal
          className="flex flex-col bg-slate-800 text-white"
          open={props.open}
          setOpen={props.setOpen}
      >
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-bold">Withdraw</h1>
          </div>
          <PaddedIcon
              onClick={() => props.setOpen(false)}
              className="hover:scale-110 transition-all duration-200 cursor-pointer"
              icon={XMarkIcon}
              size="large"
          />
        </div>
        <div className="flex flex-col space-y-3">
          <VaultInput />
          <div>
            <h3 className="font-semibold text-xl mb-2">Withdraw Amounts</h3>
            <div className="flex flex-row space-x-6">
              <Input
                  label={<div
                      className="bg-green-600 text-sm px-3 py-0.5 inline-flex items-center rounded-t font-medium text-white"
                  >
                    I Tokens
                  </div>}
                  className="font-bold text-md"
                  type="text"
                  name="Dual-Asset Deposit"
                  id="deposit-amount"
                  // @ts-ignore
                  value={asset1DepositAmount}
                  onChange={(event) =>
                      setAsset1DepositAmount(event.target.value)
                  }
              />
              <Input
                  label={<div
                      className="bg-purple-500 text-sm px-3 py-0.5 inline-flex items-center rounded-t font-medium text-white"
                  >
                    J Tokens
                  </div>}
                  className="font-bold text-md"
                  type="text"

                  name="Deposit"
                  id="deposit-amount"
                  // @ts-ignore
                  value={asset2DepositAmount}
              />
            </div>
          </div>
        </div>
        <button
            className="bg-cyan-600 text-white font-bold rounded-md px-4 py-2 mt-8 flex-1"
            onClick={async () => {
              if (!wallet) {
                return;
              }
              const group = await sdk?.fetchGroup(new PublicKey("9SJXMSppEe8A5YYhJrESuqXHzFVNR1jp3exwpcqsCcLD"));
              if (!group) {
                return;
              }
              await sdk?.redeemRpc(
                  [],
                  group,
                  new PublicKey("Fsdk5gur6iyFsqVoo2hLB9Z99X4ZVYstAV26akd4yEFv"),
                  wallet.publicKey,
                  new BN(Math.floor(0.001 * 10 ** 9)),
                  new BN(Math.floor(0.001 * 10 ** 9))
              );
            }}
        >
          Redeem Tokens
        </button>
      </Modal>
  );
};

export default DepositModal;
