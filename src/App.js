import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useState } from 'react';
import './App.css';

const ffmpeg = new FFmpeg();
await ffmpeg.load();

function secondsToTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000); // 获取毫秒部分

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
  const formattedMilliseconds = milliseconds.toString().padStart(3, '0'); // 保留三位毫秒

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

function ImgDisply({ visible, fname }) {
  if (!visible) {
    return <img src={fname} alt='img'></img>;
  } else {
    return (<></>)
  }
}

function VideoDisply({ visible, fname, onTimeUpdateF }) {
  if (!visible) {
    return <video controls onTimeUpdate={onTimeUpdateF}>
      <source src={fname}></source>
    </video >;
  } else {
    return (<></>)
  }
}

function ImgSelect({ onchange }) {
  return <input type='file' onChange={onchange}></input>;
}

function App() {
  const [imgPath, setImgPath] = useState("");
  const [noImg, setnoImg] = useState(true);
  const [videoPath, setVideoPath] = useState("");
  const [videoData, setVideoData] = useState("");
  const [noVideo, setNoVideo] = useState(true);
  const [t, setT] = useState("00:00:01");


  function imgChange(evt) {
    if (evt.target.files && evt.target.files[0]) {
      setImgPath(URL.createObjectURL(evt.target.files[0]));
      setnoImg(false);
    }
    console.log(imgPath);
  };

  function videoChange(evt) {
    if (evt.target.files && evt.target.files[0]) {
      const file = evt.target.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        setVideoData(e.target.result);
        setVideoPath(file);
        setNoVideo(false);
      };

      reader.readAsDataURL(file);
    }
    console.log(imgPath);
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-center">
        视频提取图片
      </h2>
      <div className="flex h-screen w-full">
        <div id="img-disply" className='w-2/3 p-2 border border-1 rounded-lg place-content-center'>
          <VideoDisply visible={noVideo} fname={videoData} onTimeUpdateF={e => {
            setT(secondsToTime(e.target.currentTime))
          }} />
        </div>
        <div id='option' className='w-1/3 p-2 border border-1 rounded-lg place-content-center'>
          <div className='h-1/3 border border-1 rounded-lg p-2'>
            <div className='container grid grid-cols-4 gap-2 pt-1'>
              <label className='col-span-1'>选择视频</label>
              <div className='col-span-3'>
                <ImgSelect onchange={videoChange} />
              </div>
            </div>
            <div className='container grid grid-cols-4 gap-2 pt-1'>
              <label className='col-span-1'>提取视频帧位置</label>
              <div className='col-span-3'>
                <input type='text' value={t} onChange={e => {
                  setT(e.target.value)
                }} className='border border-1 rounded-lg'></input>
              </div>
            </div>
            <div>
            </div>
            <div className='container grid grid-cols-4 gap-2 pt-1'>
              <button className='border border-1 rounded-lg p-2 col-span-1'
                onClick={_ => {
                  (async () => {
                    await ffmpeg.writeFile('input.webm', await fetchFile(videoPath));
                    //-ss 00:01:30 -vframes:v 1 ttt_frame.png
                    await ffmpeg.exec(['-i', 'input.webm', '-ss', `${t}`, '-vframes:v', '1', 'output.png']).catch(v => {
                      console.log("ffmpeg exec err: ", v);
                    });

                    const data = await ffmpeg.readFile('output.png');
                    setImgPath(URL.createObjectURL(new Blob([Uint8Array.from(data)], { type: 'image/png' })));
                    setnoImg(false);
                  })();
                }}>提取为图片</button>
              <button onClick={e => {
                const link = document.createElement("a");
                link.href = imgPath;
                link.download = `img-fix-${t.replace(":", "_")}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
              }}>下载图片</button>
            </div>
          </div>
          <div className='h-2/3 border border-1 rounded-lg p-2'>
            <ImgDisply visible={noImg} fname={imgPath} />
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
