
import CourseListPage from "./courses/page";
import BannerPage from "./banner/page";
export default function Home() {
  return (
    <main>
      <div className="w-full mt-8">
        <BannerPage />
      </div>
      <div className="w-full mt-8 flex justify-start ml-5">
        <CourseListPage />
      </div>
    </main>
  
  );
}