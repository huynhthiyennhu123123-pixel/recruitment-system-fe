import { useNavigate } from "react-router-dom"
import "../../styles/RegisterModal.css"
import employerImg from "../../assets/images/employer.png"
import applicantImg from "../../assets/images/applicant.png"

export default function RegisterModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  if (!isOpen) return null

  const handleSelect = (path) => {
    onClose()         
    navigate(path)    
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Chào bạn,</h2>
        <p>Để tối ưu trải nghiệm, vui lòng chọn loại tài khoản phù hợp:</p>

        <div className="modal-options">
          <div className="option">
            <img src={employerImg} alt="Nhà tuyển dụng" />
            <button className="btn-fill" onClick={() => handleSelect("/auth/employer-register")}>
              Tôi là nhà tuyển dụng
            </button>
          </div>

          <div className="option">
            <img src={applicantImg} alt="Ứng viên" />
            <button className="btn-fill" onClick={() => handleSelect("/auth/register")}>
              Tôi là ứng viên tìm việc
            </button>
          </div>
        </div>

        <button className="modal-close" onClick={onClose}>×</button>
      </div>
    </div>
  )
}