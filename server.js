// ========== 서버 설정 ==========
import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

// Express 앱 만들기
const app = express();
const port = 5000;  // 서버 포트

// 미들웨어 설정
app.use(cors());         // 다른 포트에서 접근 허용
app.use(express.json());  // JSON 데이터 받기

// 데이터베이스 연결
const db = new sqlite3.Database('./bookings.db');

// ========== API 엔드포인트 ==========

// 1. 회의실 목록 가져오기 (GET /api/rooms)
app.get('/api/rooms', (req, res) => {
  // 데이터베이스에서 모든 회의실 조회
  db.all('SELECT * FROM rooms', [], (err, rooms) => {
    if (err) {
      res.status(500).json({ error: '서버 오류' });
      return;
    }
    // 회의실 목록을 JSON으로 전송
    res.json(rooms);
  });
});

// 2. 예약 목록 가져오기 (GET /api/bookings)
app.get('/api/bookings', (req, res) => {
  // 날짜와 시간 순으로 정렬해서 조회
  db.all('SELECT * FROM bookings ORDER BY date, start_time', [], (err, bookings) => {
    if (err) {
      res.status(500).json({ error: '서버 오류' });
      return;
    }
    // 예약 목록을 JSON으로 전송
    res.json(bookings);
  });
});

// 3. 새 예약 만들기 (POST /api/bookings)
app.post('/api/bookings', (req, res) => {
  // 요청 본문에서 데이터 가져오기
  const { room_id, date, start_time, end_time, booked_by } = req.body;
  
  // 먼저 겹치는 예약이 있는지 확인
  const checkSQL = `
    SELECT * FROM bookings 
    WHERE room_id = ? AND date = ? 
    AND ((start_time < ? AND end_time > ?) 
      OR (start_time < ? AND end_time > ?))
  `;
  
  db.get(checkSQL, [room_id, date, end_time, start_time, start_time, end_time], (err, existing) => {
    if (err) {
      res.status(500).json({ error: '서버 오류' });
      return;
    }
    
    // 이미 예약이 있으면 오류 반환
    if (existing) {
      res.status(400).json({ error: '이미 예약된 시간입니다' });
      return;
    }
    
    // 예약이 없으면 새로 추가
    const insertSQL = 'INSERT INTO bookings (room_id, date, start_time, end_time, booked_by) VALUES (?, ?, ?, ?, ?)';
    
    db.run(insertSQL, [room_id, date, start_time, end_time, booked_by], function(err) {
      if (err) {
        res.status(500).json({ error: '예약 실패' });
        return;
      }
      // 성공! 새 예약 정보 반환
      res.json({ 
        id: this.lastID, 
        room_id, 
        date, 
        start_time, 
        end_time, 
        booked_by 
      });
    });
  });
});

// 4. 예약 취소하기 (DELETE /api/bookings/:id)
app.delete('/api/bookings/:id', (req, res) => {
  // URL에서 예약 ID 가져오기
  const bookingId = req.params.id;
  
  // 데이터베이스에서 삭제
  db.run('DELETE FROM bookings WHERE id = ?', bookingId, function(err) {
    if (err) {
      res.status(500).json({ error: '삭제 실패' });
      return;
    }
    // 성공 메시지 반환
    res.json({ message: '예약 취소 완료' });
  });
});

// ========== 서버 시작 ==========
app.listen(port, () => {
  console.log(`✅ 서버가 시작되었습니다: http://localhost:${port}`);
  console.log('📌 Ctrl+C를 눌러서 서버를 종료할 수 있습니다');
});