import glob,subprocess
fs=sorted(glob.glob('ipad/*.png'));UI={6,7,8,9};F=1.0
dur=[(15 if i in UI else 12) for i in range(1,len(fs)+1)]
fs2=fs+[fs[0]];dur2=dur+[1.1]
inp=[]
for f,d in zip(fs2,dur2): inp+=['-framerate','25','-loop','1','-t',str(d+F),'-i',f]
flt=[f'[{i}:v]scale=1920:1334,setsar=1[s{i}]' for i in range(len(fs2))];prev='[s0]';off=0
for i in range(1,len(fs2)):
    off+=dur2[i-1];o=f'[v{i}]';flt.append(f'{prev}[s{i}]xfade=transition=fade:duration={F}:offset={off:.2f}{o}');prev=o
total=sum(dur)
cmd=['ffmpeg','-y','-loglevel','error']+inp+['-filter_complex',';'.join(flt)+f';{prev}trim=duration={total},format=yuv420p[out]','-map','[out]','-r','25','-c:v','libx264','-preset','veryfast','-crf','20','-tune','stillimage','-movflags','+faststart','one.mp4']
subprocess.run(cmd,check=True);print(total)
