'use client';
import { FaFacebook, FaYoutube, FaTiktok } from 'react-icons/fa';
import Link from 'next/link';

import Image from 'next/image';
import LogoH3 from '@/public/images/logo-h3.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Cột 1: Logo + Thông tin liên hệ */}
        <div>
            <h1 className="flex items-center space-x-3 mb-5">
            {/* Logo */}
            <Link href="/" className="rounded-lg">
              <Image className="rounded-lg" src={LogoH3} alt="Logo H3" width={40} height={40} />
            </Link>
            <Link href="/" className="font-semibold text-lg text-white hover:text-pink-200">
              Học Lập Trình Cùng H3
            </Link>
          </h1>
          <p className="mt-3 text-sm">
            <strong>Điện thoại:</strong> 07 9782 3018
          </p>
          <p className="text-sm">
            <strong>Email:</strong> contact@developer.edu.vn
          </p>
          <p className="text-sm">
            <strong>Địa chỉ:</strong> Số 1, ngõ 41, Trần Duy Hưng, Cầu Giấy, Hà Nội
          </p>
          <div>
            <Image
              src="https://images.dmca.com/Badges/dmca-badge-w250-2x1-03.png"
              alt="DMCA Protected"
              className="mt-3"
              width={100}
              height={40}
            />
          </div>
        </div>

        {/* Cột 2: Về H3 */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-white">VỀ H3</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-white">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Liên hệ
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Điều khoản
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Bảo mật
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Sản phẩm */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-white">SẢN PHẨM</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:text-white">
                Game Nester
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Game CSS Diner
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Game CSS Selectors
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Game Froggy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Game Froggy Pro
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Game Scoops
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 4: Công cụ */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-white">CÔNG CỤ</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:text-white">
                Tạo CV xin việc
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Rút gọn liên kết
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Clip-path maker
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Snippet generator
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                CSS Grid generator
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Cảnh báo sờ tay lên mặt
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 5: Công ty */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-white">
            CÔNG TY CỔ PHẦN CÔNG NGHỆ GIÁO DỤC H3
          </h3>
          <p className="text-sm">
            <strong>Mã số thuế:</strong> 0909090909
          </p>
          <p className="text-sm">
            <strong>Ngày thành lập:</strong> 01/03/2025
          </p>
          <p className="mt-2 text-sm">
            Lĩnh vực hoạt động: Giáo dục, công nghệ - lập trình. Chúng tôi tập trung xây dựng và
            phát triển các sản phẩm mang lại giá trị cho cộng đồng lập trình viên Việt Nam.
          </p>

          {/* Mạng xã hội */}
          <div className="flex space-x-4 mt-3">
            <Link href="#" className="text-gray-400 hover:text-white">
              <FaYoutube size={24} />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <FaFacebook size={24} />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <FaTiktok size={24} />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-xs mt-10">
        © 2025 H3. Nền tảng học lập trình hàng đầu Việt Nam (Bốc phét)
      </div>
    </footer>
  );
};

export default Footer;
