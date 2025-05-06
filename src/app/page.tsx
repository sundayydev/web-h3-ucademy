
import CoursesPage from "./courses/page";
import BannerPage from './banner/page';
import CardPost from './post/cardPost';


export default function Home() {
  return (
    <main className="px-4 md:px-8 lg:px-16">
      {/* Banner */}
      <section className="w-full mt-8">
        <BannerPage />
      </section>

      {/* Khóa học nổi bật */}
      <section className="w-full mt-12">

        <h2 className="text-3xl font-bold text-gray-800 mb-6">Khóa học nổi bật</h2>
        <CoursesPage />
      </section>

      {/* Bài viết nổi bật */}
      <section className="w-full mt-12 mb-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Bài viết nổi bật
        </h2>
        <CardPost />
      </section>
    </main>
  );
}
