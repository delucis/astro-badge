import satori from 'satori';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getPathFor = (filename: string) => {
  const localPath = path.join(__dirname + '/' + filename);
  return localPath;
};

const generate = async (username: string) => {
  const svg = await satori(
    <div
      style={{
        borderRadius: '1rem',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <h1
        style={{
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: '3rem',
          color: 'black',
        }}
      >
        Hello World
      </h1>
      <h2 style={{
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: '2rem',
        color: 'black',
      }}>{username}</h2>
      <p
        style={{
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: '1rem',
          color: 'black',
        }}
      >
        This is a simple test using Satori
      </p>
    </div>,
    {
      width: 300,
      height: 200,
      fonts: [
        {
          name: 'Inter',
          data: await readFile(getPathFor('Inter-Regular.ttf')),
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );
  return svg;
};

export default generate;
