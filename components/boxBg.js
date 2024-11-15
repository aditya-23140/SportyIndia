export default function BoxBg ()  {
  return (
    <div className="z-10">
      <ul className="circles">
        <li></li><li></li><li></li><li></li><li></li>
        <li></li><li></li><li></li><li></li><li></li>
      </ul>
      <style jsx>{`
        .circles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        .loginContainer {
          position: relative; 
          z-index: 1;
        }
        .circles li {
          position: absolute;
          width: 30px;
          height: 30px;
          background: rgba(255, 255, 255, .5);
          animation: 25s linear infinite animate;
          bottom: -150px;
        }
        @keyframes animate {
          0% {
            transform: translateY(0) rotate(0);
            opacity: 1;
            border-radius: 0;
          }
          100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
            border-radius: 50%;
          }
        }
        .circles li:nth-child(1) {
          left: 25%;
          width: 120px;
          height: 120px;
          animation-delay: 0s;
        }
        .circles li:nth-child(2) {
          left: 10%;
          width: 30px;
          height: 30px;
          animation-delay: 2s;
          animation-duration: 12s;
        }
        .circles li:nth-child(3) {
          left: 70%;
          width: 30px;
          height: 30px;
          animation-delay: 4s;
        }
        .circles li:nth-child(4) {
          left: 40%;
          width: 90px;
          height: 90px;
          animation-delay: 0s;
          animation-duration: 18s;
        }
        .circles li:nth-child(5) {
          left: 65%;
          width: 30px;
          height: 30px;
          animation-delay: 0s;
        }
        .circles li:nth-child(6) {
          left: 85%;
          width: 45px;
          height: 45px;
          animation-delay: 0s;
        }
        .circles li:nth-child(7) {
          left: 15%;
          width: 20px;
          height: 20px;
          animation-delay: 0s;
        }
        .circles li:nth-child(8) {
          left: 50%;
          width: 70px;
          height: 70px;
          animation-delay: 0s;
          animation-duration: 16s;
        }
        .circles li:nth-child(9) {
          left: 5%;
          width: 60px;
          height: 60px;
          animation-delay: 2s;
          animation-duration: 22s;
        }
        .circles li:nth-child(10) {
          left: 90%;
          width: 50px;
          height: 50px;
          animation-delay: 0s;
        }
      `}</style>
    </div>
  )
}