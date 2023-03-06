import OverviewCard from "@components/Dashboard/OverviewCard";
import YourVaultsCard from "@components/Dashboard/YourVaultsCard";
import Layout from "@components/Layout";
import {
  BanknotesIcon,
  FireIcon,
  UserGroupIcon,
} from "@heroicons/react/20/solid";
import YourPortfolioCard from "@components/Dashboard/YourPortfolioCard";
import VaultCard from "@components/Dashboard/VaultCard";

const Home = () => {
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
            <VaultCard />
            <VaultCard />
            <VaultCard />
          </div>
          <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8">
            <VaultCard />
            <VaultCard />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
