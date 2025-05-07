import { User, CreateUserDto, UpdateUserDto } from '@/types/user';

// Định nghĩa base URL của backend (thay đổi theo cấu hình của bạn)
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/users`;

// Lấy danh sách người dùng
export const getUsers = async (): Promise<User[]> => {
    const response = await fetch(BASE_URL, {
        method: 'GET',
        credentials: 'include', // Đảm bảo gửi cookie xác thực
    });
    if (!response.ok) {
        throw new Error('Không thể lấy danh sách người dùng');
    }
    return response.json();
};

// Lấy thông tin một người dùng theo ID
export const getUserById = async (id: string): Promise<User> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
        credentials: 'include', // Đảm bảo gửi cookie xác thực
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không tìm thấy người dùng. Phiên đăng nhập có thể đã hết hạn.');
    }
    const userData = await response.json();
    if (!userData?.id) {
        throw new Error('Dữ liệu người dùng không hợp lệ: Thiếu ID');
    }
    return userData;
};

// Tạo người dùng mới
export const createUser = async (userData: CreateUserDto): Promise<User> => {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Không thể tạo người dùng');
    }
    return response.json();
};

// Cập nhật thông tin người dùng
export const updateUser = async (id: string, userData: UpdateUserDto): Promise<User> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Không thể cập nhật người dùng');
    }
    return response.json();
};

// Xóa người dùng
export const deleteUser = async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Không thể xóa người dùng');
    }
};