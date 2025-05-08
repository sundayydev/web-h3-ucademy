// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { Play, ChevronDown, ChevronUp, ArrowLeft, Clock, Calendar } from 'lucide-react';
// import { FaPlayCircle } from 'react-icons/fa';
// import { getLessonsByChapterId, getLessonById } from '@/api/lessonApi';
// import { getChaptersByCourseId } from '@/api/chapterApi';
// import { getUserInfo } from '@/api/authApi';
// import YouTube from 'react-youtube';
// import { toast } from "react-toastify";
// import { Chapter } from '@/types/chapter';
// import { Lesson } from '@/types/lesson';

// const DetailsPageCourse = () => {
//   const { lessonId } = useParams();
//   const router = useRouter();
//   const playerRef = useRef<YouTube>(null);

//   const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
//   const [chapters, setChapters] = useState<Chapter[]>([]);
//   const [lessonsByChapter, setLessonsByChapter] = useState<Record<string, Lesson[]>>({});
//   const [openChapters, setOpenChapters] = useState<Record<number, boolean>>({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [completedLessons, setCompletedLessons] = useState(0);
//   const [isNotePopupOpen, setIsNotePopupOpen] = useState(false);
//   const [isViewNotesPopupOpen, setIsViewNotesPopupOpen] = useState(false);
//   const [noteContent, setNoteContent] = useState('');
//   const [currentVideoTime, setCurrentVideoTime] = useState(0);
//   const [savedNotes, setSavedNotes] = useState('');
//   const [userId, setUserId] = useState<string | null>(null);

//   const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

//   // Hàm định dạng thời gian
//   const formatDuration = (isoDuration: string) => {
//     if (typeof isoDuration !== 'string' || !isoDuration) return '0:00';
//     const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
//     const hours = match && match[1] ? parseInt(match[1]) : 0;
//     const minutes = match && match[2] ? parseInt(match[2]) : 0;
//     const seconds = match && match[3] ? parseInt(match[3]) : 0;
//     return `${hours > 0 ? hours + ':' : ''}${minutes < 10 && hours > 0 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   const formatVideoTime = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   const extractVideoId = (url: string) => {
//     const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
//     return url?.match(regex)?.[1] || null;
//   };

//   const onPlayerReady = (event: any) => {
//     playerRef.current = event.target;
//   };

//   const onPlayerStateChange = async (event: any) => {
//     if (event.data === 0) {
//       await handleLessonComplete();
//       await navigateToNextLesson();
//     }
//   };

//   const handleOpenNotePopup = () => {
//     if (playerRef.current) {
//       const currentTime = playerRef.current.getCurrentTime();
//       setCurrentVideoTime(currentTime);
//     }
//     setIsNotePopupOpen(true);
//   };

//   const handleOpenViewNotesPopup = async () => {
//     if (!userId || !lessonId) {
//       setError('Vui lòng đăng nhập để xem ghi chú.');
//       return;
//     }

//     try {
//       const response = await fetch(`${apiBaseUrl}/api/Progress/user/${userId}/lesson/${lessonId}`, {
//         headers: { 'Authorization': `Bearer ${await getAuthTokenFromCookie()}` },
//         credentials: 'include',
//       });

//       if (response.status === 404) {
//         setSavedNotes('Chưa có ghi chú.');
//       } else if (!response.ok) {
//         throw new Error('Không thể lấy ghi chú');
//       } else {
//         const progress = await response.json();
//         setSavedNotes(progress.notes || 'Chưa có ghi chú.');
//       }
//       setIsViewNotesPopupOpen(true);
//     } catch (err) {
//       console.error('Lỗi khi lấy ghi chú:', err);
//       setSavedNotes('Có lỗi xảy ra khi lấy ghi chú.');
//       setIsViewNotesPopupOpen(true);
//     }
//   };

//   const initializeProgress = async () => {
//     if (!userId || !lessonId) return;

//     try {
//       const response = await fetch(`${apiBaseUrl}/api/Progress/user/${userId}/lesson/${lessonId}`, {
//         headers: { 'Authorization': `Bearer ${await getAuthTokenFromCookie()}` },
//         credentials: 'include',
//       });

//       if (response.status === 404) {
//         const progressData = { userId, lessonId, status: 'not started' };
//         const createResponse = await fetch(`${apiBaseUrl}/api/Progress`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${await getAuthTokenFromCookie()}`,
//           },
//           body: JSON.stringify(progressData),
//           credentials: 'include',
//         });

//         if (!createResponse.ok) throw new Error('Không thể tạo tiến độ');
//       }
//     } catch (err) {
//       console.error('Lỗi khi khởi tạo tiến độ:', err);
//       setError('Không thể khởi tạo tiến độ.');
//     }
//   };

//   const handleLessonComplete = async () => {
//     if (!userId || !lessonId) return;

//     try {
//       const progressResponse = await fetch(`${apiBaseUrl}/api/Progress/user/${userId}/lesson/${lessonId}`, {
//         headers: { 'Authorization': `Bearer ${await getAuthTokenFromCookie()}` },
//         credentials: 'include',
//       });

//       if (!progressResponse.ok) throw new Error('Không tìm thấy tiến độ');
//       const progress = await progressResponse.json();
//       const progressId = progress.id;

//       const updateData = {
//         status: 'completed',
//         completionPercentage: 100,
//         notes: progress.notes || '',
//       };

//       const updateResponse = await fetch(`${apiBaseUrl}/api/Progress/${progressId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${await getAuthTokenFromCookie()}`,
//         },
//         body: JSON.stringify(updateData),
//         credentials: 'include',
//       });

//       if (!updateResponse.ok) throw new Error('Không thể cập nhật tiến độ');

//       const courseProgressResponse = await fetch(
//         `${apiBaseUrl}/api/Progress/course/${currentLesson?.courseId}/user/${userId}`,
//         { headers: { 'Authorization': `Bearer ${await getAuthTokenFromCookie()}` }, credentials: 'include' }
//       );

//       if (courseProgressResponse.status === 404) {
//         setCompletedLessons(0);
//       } else if (!courseProgressResponse.ok) {
//         throw new Error('Không thể lấy tiến độ khóa học');
//       } else {
//         const progresses = await courseProgressResponse.json();
//         const completed = progresses.filter((p: any) => p.status === 'completed' || p.completionPercentage === 100).length;
//         setCompletedLessons(completed);
//       }
//     } catch (err) {
//       console.error('Lỗi khi cập nhật tiến độ:', err);
//       setError('Không thể cập nhật tiến độ.');
//     }
//   };

//   const navigateToNextLesson = () => {
//     const allLessons = Object.values(lessonsByChapter).flat();
//     const currentIndex = allLessons.findIndex(lesson => lesson.id === lessonId);

//     if (currentIndex === -1 || currentIndex === allLessons.length - 1) {
//       toast.info('Đây là bài học cuối cùng.');
//       return;
//     }

//     const nextLesson = allLessons[currentIndex + 1];
//     router.push(`/detailsPageCourse/${nextLesson.id}`);
//   };

//   const handleSaveNote = async () => {
//     if (!userId || !lessonId || !noteContent) {
//       toast.error('Thiếu thông tin để lưu ghi chú.');
//       return;
//     }

//     try {
//       const progressResponse = await fetch(`${apiBaseUrl}/api/Progress/user/${userId}/lesson/${lessonId}`, {
//         headers: { 'Authorization': `Bearer ${await getAuthTokenFromCookie()}` },
//         credentials: 'include',
//       });

//       if (!progressResponse.ok) throw new Error('Không tìm thấy tiến độ');
//       const progress = await progressResponse.json();
//       const progressId = progress.id;

//       const formattedNote = `${formatVideoTime(currentVideoTime)}: ${noteContent}`;
//       const updatedNotes = progress.notes ? `${progress.notes}\n${formattedNote}` : formattedNote;

//       const updateData = {
//         status: progress.status || 'not started',
//         completionPercentage: progress.completionPercentage || 0,
//         notes: updatedNotes,
//       };

//       const updateResponse = await fetch(`${apiBaseUrl}/api/Progress/${progressId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${await getAuthTokenFromCookie()}`,
//         },
//         body: JSON.stringify(updateData),
//         credentials: 'include',
//       });

//       if (!updateResponse.ok) throw new Error('Không thể lưu ghi chú');

//       setSavedNotes(updatedNotes);
//       setIsNotePopupOpen(false);
//       setNoteContent('');
//       toast.success('Ghi chú đã được lưu thành công.');
//     } catch (err) {
//       console.error('Lỗi khi lưu ghi chú:', err);
//       toast.error('Không thể lưu ghi chú.');
//     }
//   };

//   // Hàm lấy token từ cookie (giả định backend gửi token qua cookie)
//   const getAuthTokenFromCookie = async () => {
//     try {
//       const response = await fetch(`${apiBaseUrl}/api/auth/check`, {
//         credentials: 'include',
//       });
//       if (response.ok) {
//         const data = await response.json();
//         return data.token || ''; // Giả định backend trả token nếu đã đăng nhập
//       }
//       return '';
//     } catch (err) {
//       console.error('Lỗi khi lấy token từ cookie:', err);
//       return '';
//     }
//   };

//   useEffect(() => {
//     const fetchLesson = async () => {
//       if (!lessonId) {
//         setError('Vui lòng cung cấp lessonId hợp lệ.');
//         setLoading(false);
//         return;
//       }

//       try {
//         // Lấy thông tin người dùng từ cookie
//         const userInfo = await getUserInfo();
//         if (!userInfo || !userInfo.userId) {
//           setError('Vui lòng đăng nhập.');
//           setLoading(false);
//           router.push('/login'); // Redirect nếu không đăng nhập
//           return;
//         }
//         setUserId(userInfo.userId);

//         const lessonResponse = await getLessonById(lessonId as string);
//         if (!lessonResponse) throw new Error('Không có dữ liệu bài học');
//         setCurrentLesson(lessonResponse);

//         const videoId = extractVideoId(lessonResponse.videoUrls);
//         if (videoId) {
//           const youtubeResponse = await fetch(
//             `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
//           );
//           const youtubeData = await youtubeResponse.json();
//           if (youtubeData.items?.length > 0) {
//             const duration = youtubeData.items[0].contentDetails.duration || 'PT0S';
//             setCurrentLesson(prev => prev ? ({ ...prev, duration }) : null);
//           } else {
//             console.error('No YouTube video data found for videoId:', videoId);
//             setCurrentLesson(prev => prev ? ({ ...prev, duration: 'PT0S' }) : null);
//           }
//         }

//         if (lessonResponse.courseId) {
//           const chaptersResponse = await getChaptersByCourseId(lessonResponse.courseId);
//           setChapters(chaptersResponse || []);

//           const lessonsMap: Record<string, Lesson[]> = {};
//           for (const chapter of chaptersResponse) {
//             const lessons = await getLessonsByChapterId(chapter.id);
//             lessonsMap[chapter.id] = lessons;
//           }
//           setLessonsByChapter(lessonsMap);

//           const progressResponse = await fetch(
//             `${apiBaseUrl}/api/Progress/course/${lessonResponse.courseId}/user/${userId}`,
//             { headers: { 'Authorization': `Bearer ${await getAuthTokenFromCookie()}` }, credentials: 'include' }
//           );

//           if (progressResponse.status === 404) {
//             setCompletedLessons(0);
//           } else if (!progressResponse.ok) {
//             throw new Error('Không thể lấy tiến độ khóa học');
//           } else {
//             const progresses = await progressResponse.json();
//             const completed = progresses.filter((p: any) => p.status === 'completed' || p.completionPercentage === 100).length;
//             setCompletedLessons(completed);
//           }
//         }

//         await initializeProgress();
//       } catch (err) {
//         console.error('Lỗi khi lấy bài học:', err);
//         setError(err.message || 'Có lỗi xảy ra khi tải bài học.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLesson();
//   }, [lessonId, router]);

//   const formatDate = (isoString: string) => {
//     return isoString ? new Date(isoString).toLocaleDateString('vi-VN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     }) : 'Không rõ ngày';
//   };

//   if (loading) return <p>Đang tải...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   const allLessons = Object.values(lessonsByChapter).flat();
//   const totalLessons = allLessons.length;
//   const completionPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
//   const videoId = extractVideoId(currentLesson?.videoUrls || '');

//   return (
//     <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
//       <div className="bg-gray-800 text-white flex items-center justify-between p-4 h-[50px] mt-16">
//         <div className="flex items-center">
//           <ArrowLeft size={24} className="mr-3 cursor-pointer" onClick={() => router.back()} />
//           <span className="ml-3 font-semibold">Khóa học</span>
//         </div>
//         <div className="flex items-center space-x-6">
//           <div className="flex items-center">
//             <Play size={18} className="mr-2 text-gray-400" />
//             <span className="text-sm">
//               Đã học: {completedLessons} / {totalLessons} bài ({completionPercentage.toFixed(2)}%)
//             </span>
//           </div>
//           <div className="flex items-center cursor-pointer hover:text-gray-300">
//             <FaPlayCircle size={18} className="mr-2 text-gray-400" />
//             <span className="text-sm">Hướng dẫn</span>
//           </div>
//           <div className="flex items-center cursor-pointer hover:text-gray-300" onClick={handleOpenViewNotesPopup}>
//             <Clock size={18} className="mr-2 text-blue-400" />
//             <span className="text-sm">Ghi chú</span>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-1 overflow-hidden mt-1">
//         <div className="flex-[3] overflow-y-auto">
//           <div className="bg-black flex items-center justify-center min-h-[500px] relative">
//             {videoId ? (
//               <YouTube
//                 videoId={videoId}
//                 opts={{ width: '1000', height: '500', playerVars: { autoplay: 0 } }}
//                 onReady={onPlayerReady}
//                 onStateChange={onPlayerStateChange}
//               />
//             ) : (
//               <p>Không có video để hiển thị.</p>
//             )}
//           </div>

//           <div className="bg-white border-t border-gray-200 py-6 px-8">
//             <h2 className="text-2xl font-bold">{currentLesson?.title}</h2>
//             <div className="flex items-center text-gray-500 mb-6">
//               <Calendar size={16} className="mr-2" />
//               <span className="text-sm mr-3">{formatDate(currentLesson?.createdAt || '')}</span>
//               {currentLesson?.duration && (
//                 <span className="text-sm">Độ dài: {formatDuration(currentLesson.duration)}</span>
//               )}
//             </div>
//             <p>{currentLesson?.content || 'Không có mô tả.'}</p>
//             <button onClick={handleOpenNotePopup} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
//               Lưu ghi chú
//             </button>
//           </div>
//         </div>

//         <div className="flex-1 p-3 bg-gray-100 rounded-lg overflow-y-auto">
//           <h2 className="text-lg font-bold sticky top-0 bg-gray-100 z-10 pb-2">Nội dung khóa học</h2>
//           {chapters.map((chapter, index) => (
//             <div key={chapter.id} className="mb-3">
//               <div
//                 className="flex justify-between items-center p-3 bg-gray-200 rounded-lg cursor-pointer"
//                 onClick={() => setOpenChapters(prev => ({ ...prev, [index]: !prev[index] }))}
//               >
//                 <span className="font-bold">{chapter.title}</span>
//                 {openChapters[index] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//               </div>
//               {openChapters[index] && (
//                 <ul className="mt-2">
//                   {lessonsByChapter[chapter.id]?.map(lesson => (
//                     <li
//                       key={lesson.id}
//                       className={`p-3 rounded-lg cursor-pointer ${lessonId === lesson.id ? 'bg-red-100' : ''}`}
//                       onClick={() => router.push(`/detailsPageCourse/${lesson.id}`)}
//                     >
//                       <div className="flex flex-col">
//                         <span className="text-sm">{lesson.title}</span>
//                         <span className="text-xs text-gray-500 flex items-center">
//                           <FaPlayCircle className="mr-2 text-xs" />
//                           <span>{formatDate(lesson.createdAt)}</span>
//                         </span>
//                       </div>
//                     </li>
//                   )) || <li className="p-3 text-gray-500">Chưa có bài học</li>}
//                 </ul>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {isNotePopupOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-4 rounded-lg shadow-lg w-96">
//             <h2 className="text-lg font-bold mb-2">
//               Thêm ghi chú tại <span className="text-orange-500">{formatVideoTime(currentVideoTime)}</span>
//             </h2>
//             <textarea
//               value={noteContent}
//               onChange={e => setNoteContent(e.target.value)}
//               placeholder="Nội dung ghi chú..."
//               className="w-full p-2 border rounded-lg mb-4"
//             />
//             <div className="flex justify-end space-x-2">
//               <button onClick={() => setIsNotePopupOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
//                 Hủy bỏ
//               </button>
//               <button onClick={handleSaveNote} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
//                 Tạo ghi chú
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isViewNotesPopupOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-4 rounded-lg shadow-lg w-96">
//             <h2 className="text-lg font-bold mb-2">Ghi chú - {currentLesson?.title}</h2>
//             <p className="text-sm whitespace-pre-wrap">{savedNotes}</p>
//             <button
//               onClick={() => setIsViewNotesPopupOpen(false)}
//               className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
//             >
//               Đóng
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DetailsPageCourse;
