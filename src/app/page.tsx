import DashboardLayout from "./category/layout";
import Category from "./category/page";

export default function Home() {
  return (
    <div>
      <div className="flex w-[1170px] m-auto items-start justify-between">
        <DashboardLayout>
          <Category />
        </DashboardLayout>
      </div>
    </div>
  );
}
