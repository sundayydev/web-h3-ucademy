import Image from 'next/image';
import bannerImage from '@/assets/imgs/banner1.png';

export default function BannerPage() {
  return (
    <div className="w-full m-5">
      <Image
        src={bannerImage}
        alt="Banner Khóa Học"
        width={1300}
        height={300}
        className="w-[1300] h-[300px] object-cover border-2 rounded-2xl ml-[-20px]"
        priority
      />
    </div>
  );
}
