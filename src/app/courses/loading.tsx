import HashLoader from 'react-spinners/HashLoader';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-50 bg-opacity-50 z-50">
      <HashLoader color="#a858a7" size={45} />
    </div>
  );
}