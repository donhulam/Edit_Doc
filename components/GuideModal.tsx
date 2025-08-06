import React from 'react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 m-4 max-w-2xl w-full relative transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
          aria-label="Đóng"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Giới thiệu & Hướng dẫn sử dụng</h2>
        
        <div className="text-gray-600 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <p>
            Chào mừng bạn đến với <strong>TRỢ LÝ AI SOẠN THẢO VĂN BẢN</strong>! Đây là một công cụ AI thông minh được thiết kế để giúp bạn tạo lập các văn bản hành chính nhà nước Việt Nam một cách nhanh chóng, chính xác và chuyên nghiệp, tuân thủ Nghị định 30/2020/NĐ-CP.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Các tính năng chính</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong className="text-gray-700">Soạn thảo thông minh:</strong> Gõ yêu cầu của bạn (ví dụ: "soạn một công văn đề nghị") và AI sẽ tạo ra bản nháp.
              </li>
              <li>
                <strong className="text-gray-700">Đính kèm tệp tham khảo:</strong> Nhấn vào biểu tượng kẹp ghim <i className="fas fa-paperclip text-sm"></i> để tải lên các tệp PDF, DOC, hoặc DOCX. AI sẽ phân tích nội dung tệp để đưa ra câu trả lời phù hợp hơn. Bạn có thể tải lên nhiều tệp cùng lúc.
              </li>
              <li>
                <strong className="text-gray-700">Tải xuống DOCX:</strong> Sau khi AI trả lời, nhấn nút "Tải xuống DOCX" để lưu văn bản về máy dưới định dạng .docx, sẵn sàng để chỉnh sửa.
              </li>
              <li>
                <strong className="text-gray-700">Sao chép nhanh:</strong> Nhấn nút "Sao chép" để lấy nội dung văn bản sạch (đã loại bỏ mã định dạng) vào bộ nhớ tạm.
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Mẹo sử dụng hiệu quả</h3>
            <ul className="list-disc list-inside space-y-2">
                <li>
                    <strong>Yêu cầu càng chi tiết, kết quả càng chính xác:</strong> Thay vì nói "viết công văn", hãy thử "soạn công văn của Sở A gửi Sở B về việc phối hợp tổ chức hội nghị X".
                </li>
                <li>
                    <strong>Bắt đầu cuộc trò chuyện mới:</strong> Nhấn nút "Nhiệm vụ mới" ở góc trên bên phải để xóa cuộc trò chuyện hiện tại và bắt đầu lại.
                </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;