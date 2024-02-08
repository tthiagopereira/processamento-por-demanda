import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { spawn } from 'node:child_process';

createServer(async (request, response) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*'
    };
    if (request.method === 'OPTIONS') {
        response.writeHead(204, headers);
        response.end();
        return;
    }

    response.writeHead(200, {
        'Content-Type': 'video/mp4'
    });

    const ffmpegProcess = spawn('ffmpeg', [
        '-i', 'pipe:0',
        '-vf', 'drawtext=text=\'Processando por demanda\':x=10:y=10:fontsize=24:fontcolor=white',
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-movflags', '+frag_keyframe+empty_moov+default_base_moof',
        '-b:v', '1500k',
        '-maxrate', '1500k',
        '-bufsize', '1000k',
        '-f', 'mp4',
        'pipe:1'
    ], {
        stdio: ['pipe', 'pipe', 'pipe']
    });

    createReadStream('./assets/music.mp4').pipe(ffmpegProcess.stdin);

    ffmpegProcess.stderr.on('data', msg => console.log(msg.toString()));
    ffmpegProcess.stdout.pipe(response);

    request.once('close', ()=> {
        ffmpegProcess.stdout.destroy()
        ffmpegProcess.stdin.destroy()
        console.log('Disconnected!', ffmpegProcess.kill())
    })
})
    .listen(3000, () => console.log('server is running at 3000'));
