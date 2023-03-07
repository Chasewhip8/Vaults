import OverviewCard from "@components/Dashboard/OverviewCard";
import YourVaultsCard from "@components/Dashboard/YourVaultsCard";
import Layout from "@components/Layout";
import {
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  BanknotesIcon,
  FireIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import YourPortfolioCard from "@components/Dashboard/YourPortfolioCard";
import VaultCard from "@components/Dashboard/VaultCard";
import Modal from "@components/Modal";
import Badge from "@components/Badge";
import PaddedIcon from "@components/PaddedIcon";
import PortfolioChart from "@components/Chart/PortfolioChart";
import ColumnDisplay from "@components/ColumnDisplay";
import { useRef, useState } from "react";
import VaultProgressBar from "@components/Dashboard/VaultProgressBar";

const Home = () => {
  const [openVaultModal, setOpenVaultModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleOpenVaultModal = () => {
    setOpenVaultModal(true);
  };

  return (
    <Layout className="flex flex-col space-y-6 pb-8">
      <section>
        <h2 className="text-2xl font-bold text-white">Overview</h2>
        <p className="text-gray-500 pb-3">
          An overview of the latest trends and statistics
        </p>
        <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8">
          <OverviewCard
            title="Total Members of the Flock"
            icon={UserGroupIcon}
            value="101,748"
            trend="up"
            trendValue="15,632"
            trendDescription={
              <p className="text-gray-400">
                <span className="text-green-500 font-bold">+15,634</span> new
                users this week
              </p>
            }
          />
          <OverviewCard
            title="Protocol Owned Liquidity"
            icon={BanknotesIcon}
            iconBackgroundColor="bg-green-500"
            value="$154,256,314"
            trend="down"
            trendDescription={
              <p className="text-gray-400">
                <span className="text-red-400 font-bold">-5,634</span> less than
                last month
              </p>
            }
          />
          <OverviewCard
            title="Hottest Product"
            icon={FireIcon}
            iconBackgroundColor="bg-yellow-600"
            value="J-Sol-Eth"
            trend="up"
            trendDescription={
              <p className="text-gray-400">
                Trending for{" "}
                <span className="text-green-500 font-bold">2 months</span>
              </p>
            }
          />
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white">Your Holdings</h2>
        <p className="text-gray-500 pb-3">Your portfolio and staked assets</p>
        <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8 lg:max-h-96">
          <YourPortfolioCard className="lg:w-2/5" />
          <YourVaultsCard />
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white">Available Vaults</h2>
        <p className="text-gray-500 pb-3">
          These vaults are available and can be staked at anytime
        </p>
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8">
            <VaultCard onClick={handleOpenVaultModal} />
            <VaultCard onClick={handleOpenVaultModal} />
            <VaultCard onClick={handleOpenVaultModal} />
          </div>
          <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8">
            <VaultCard onClick={handleOpenVaultModal} />
            <VaultCard onClick={handleOpenVaultModal} />
          </div>
        </div>
        <Modal
          className="bg-slate-800 text-white"
          open={openVaultModal}
          setOpen={setOpenVaultModal}
        >
          <div className="flex flex-row justify-between items-start">
            <div className="flex flex-col space-y-2">
              <h1 className="text-2xl font-bold">Vault #123</h1>
              <h3 className="text-xl font-extrabold">
                243.33% <span className="italic text-cyan-500">APR</span>
              </h3>
              <div className="flex flex-row space-x-1">
                <span className="text-lg font-semibold text-gray-400">
                  Composition:
                </span>
                <div className="space-x-1.5">
                  <Badge
                    label="50% ETH"
                    backgroundColor="bg-purple-500"
                    size="large"
                  />
                  <Badge
                    label="50% SOL"
                    backgroundColor="bg-green-600"
                    size="large"
                  />
                </div>
              </div>
            </div>
            <PaddedIcon
              onClick={() => setOpenVaultModal(false)}
              className="hover:scale-110 transition-all duration-200 cursor-pointer"
              icon={XMarkIcon}
              size="large"
            />
          </div>
          <div className="rounded overflow-hidden">
            <div className="bg-gray-900 h-64 p-4 mt-3">
              <PortfolioChart className="h-full w-full" />
            </div>
            <div className="flex flex-row bg-slate-500">
              <span className="text-sm font-bold p-2 bg-green-600">1D</span>
              <span className="text-sm font-bold p-2 bg-green-600">1W</span>
              <span className="text-sm font-bold p-2 bg-green-600">1M</span>
              <span className="text-sm font-bold p-2 bg-green-600">1Y</span>
            </div>
          </div>
          <div className="pt-4">
            <h3 className="text-xl font-semibold">Details</h3>
            <ColumnDisplay
              fields={[
                { title: "APY", content: "7.23%", columns: "one" },
                { title: "Total Deposits", content: "94,313", columns: "one" },
                {
                  title: "Composition",
                  content: "50% SOL, 50% ETH",
                  columns: "one",
                },
                {
                  title: "Vault Progress",
                  content: (
                    <div className="flex flex-col space-y-2 pt-3">
                      <VaultProgressBar quarter={1} daysRemaining={350} />
                      <VaultProgressBar quarter={2} daysRemaining={280} />
                      <VaultProgressBar quarter={3} daysRemaining={60} />
                      <VaultProgressBar quarter={4} daysRemaining={12} />
                    </div>
                  ),
                  columns: "three",
                },
              ]}
              className="pt-2"
            />
            <div className="flex flex-row justify-center pt-10">
              <button className="inline-flex flex-1 justify-center items-center gap-x-1.5 rounded-l bg-indigo-600 py-1.5 px-2.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Withdraw
                <ArrowUpOnSquareIcon
                  className="-mr-0.5 h-5 w-5"
                  aria-hidden="true"
                />
              </button>
              <button className="inline-flex flex-1 justify-center items-center gap-x-1.5 rounded-r bg-green-600 py-1.5 px-2.5 text-lg font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                Deposit
                <ArrowDownOnSquareIcon
                  className="-mr-0.5 h-5 w-5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </Modal>
      </section>
    </Layout>
  );
};

export default Home;
