import { useState } from "react";
import axios from "axios";

const MyComponent = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      // POST isteği yapılıyor
      const response = await axios.post("/api/resetpassword", {
        subject,
        message,
      });

      // Yanıt işleniyor
      console.log(response.data);

      // Gönderim tamamlandıktan sonra formları sıfırla
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Konu:
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </label>
      <br />
      <label>
        Mesaj:
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Gönder</button>
    </form>
  );
};

export default MyComponent;
