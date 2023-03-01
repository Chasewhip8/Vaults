import Card from "@components/Card";
import OverviewCard from "@components/Dashboard/OverviewCard";
import YourVaultsCard from "@components/Dashboard/YourVaultsCard";
import Layout from "@components/Layout";
import {
  BanknotesIcon,
  FireIcon,
  UserGroupIcon,
} from "@heroicons/react/20/solid";

const Home = () => {
  return (
    <Layout className="flex flex-col space-y-6 py-10">
      <section>
        <h2 className="text-2xl font-bold text-white pb-3">Overview</h2>
        <div className="flex pb-4 space-x-8">
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
        <h2 className="text-2xl font-bold text-white pb-3">Your Holdings</h2>
        <div className="flex flex-row space-x-8 max-h-96">
          <Card className="w-2/5">
            <h2 className="text-2xl font-bold">Your Portfolio</h2>
            <p className="text-gray-400">Investments over time</p>
          </Card>
          <YourVaultsCard />
        </div>
      </section>
    </Layout>
  );
};

export default Home;
