// 서버 주소 설정
const API_URL = '/api';

// 1. 회의실 목록 가져오기
async function loadRooms() {
  // 서버에서 회의실 정보 가져오기
  const response = await fetch(`${API_URL}/rooms`);
  const rooms = await response.json();
  
  // HTML에서 <select> 찾기
  const roomSelect = document.getElementById('room');
  roomSelect.innerHTML = '<option value="">회의실을 선택하세요</option>';
  
  // 각 회의실을 옵션으로 추가
  rooms.forEach(room => {
    const option = document.createElement('option');
    option.value = room.id;
    option.textContent = `${room.name} (${room.capacity}명)`;
    roomSelect.appendChild(option);
  });
}

// 2. 예약 목록 보여주기
async function loadBookings() {
  // 서버에서 예약 정보 가져오기
  const response = await fetch(`${API_URL}/bookings`);
  const bookings = await response.json();
  
  // HTML에서 예약 목록 표시할 곳 찾기
  const bookingsList = document.getElementById('bookingsList');
  
  // 예약이 없으면 메시지 표시
  if (bookings.length === 0) {
    bookingsList.innerHTML = '<p>예약이 없습니다.</p>';
    return;
  }
  
  // 회의실 이름을 알기 위해 회의실 정보도 가져오기
  const roomsResponse = await fetch(`${API_URL}/rooms`);
  const rooms = await roomsResponse.json();
  
  // 예약 목록을 HTML로 만들기
  let html = '';
  bookings.forEach(booking => {
    // 회의실 이름 찾기
    const room = rooms.find(r => r.id === booking.room_id);
    const roomName = room ? room.name : '알 수 없음';
    
    html += `
      <div class="booking-item">
        <div class="booking-info">
          <h3>${roomName}</h3>
          <p>날짜: ${booking.date}</p>
          <p>시간: ${booking.start_time} - ${booking.end_time}</p>
          <p>예약자: ${booking.booked_by}</p>
        </div>
        <button class="delete-btn" onclick="deleteBooking(${booking.id})">취소</button>
      </div>
    `;
  });
  
  bookingsList.innerHTML = html;
}

// 3. 새로운 예약 만들기
async function createBooking(event) {
  event.preventDefault(); // 페이지 새로고침 방지
  
  // 폼에서 입력한 정보 가져오기
  const bookingData = {
    room_id: document.getElementById('room').value,
    date: document.getElementById('date').value,
    start_time: document.getElementById('startTime').value,
    end_time: document.getElementById('endTime').value,
    booked_by: document.getElementById('bookedBy').value
  };
  
  // 서버로 예약 정보 보내기
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',  // POST = 새로 만들기
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookingData)  // 데이터를 JSON으로 변환
  });
  
  if (response.ok) {
    // 성공 메시지 표시
    alert('예약 완료!');
    
    // 폼 비우기
    document.getElementById('bookingForm').reset();
    
    // 예약 목록 다시 불러오기
    loadBookings();
  } else {
    // 실패 메시지 표시
    alert('예약 실패! 다른 시간을 선택해주세요.');
  }
}

// 4. 예약 취소하기
async function deleteBooking(id) {
  // 정말 취소할지 확인
  if (!confirm('예약을 취소할까요?')) {
    return;
  }
  
  // 서버에 취소 요청 보내기
  const response = await fetch(`${API_URL}/bookings/${id}`, {
    method: 'DELETE'  // DELETE = 삭제하기
  });
  
  if (response.ok) {
    alert('예약 취소 완료!');
    loadBookings();  // 목록 다시 불러오기
  } else {
    alert('취소 실패!');
  }
}

// 전역 함수로 만들기 (HTML에서 사용하기 위해)
window.deleteBooking = deleteBooking;

// ========== 앱 시작하기 ==========

// 폼 제출 시 예약 만들기
document.getElementById('bookingForm').addEventListener('submit', createBooking);

// 오늘 날짜 설정
const today = new Date().toISOString().split('T')[0];
document.getElementById('date').value = today;

// 처음 시작할 때 데이터 불러오기
loadRooms();     // 회의실 목록
loadBookings();  // 예약 목록