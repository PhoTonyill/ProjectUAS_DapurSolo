import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import { MAX_IMAGE_MB, readImageFile } from '../utils';

const isDataUrl = (value) => typeof value === 'string' && value.startsWith('data:');

/**
 * Input gambar dengan dua cara: unggah file (disimulasikan, disimpan sebagai
 * data URL di memori) atau tempel URL / path (mis. /Gambar/foto.png).
 * Menampilkan pratinjau.
 */
export default function ImageInput({
  label = 'Gambar',
  value,
  onChange,
  error,
  required = false,
}) {
  const [mode, setMode] = useState('file');
  const [fileError, setFileError] = useState('');
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
    // Gambar yang sudah ada berupa path/URL -> tampilkan di mode URL
    if (value && !isDataUrl(value)) setMode('url');
  }, [value]);

  const handleFile = async (e) => {
    const input = e.target;
    const file = input.files && input.files[0];
    if (!file) return;
    try {
      setFileError('');
      onChange(await readImageFile(file));
    } catch (err) {
      setFileError(err.message);
    } finally {
      input.value = '';
    }
  };

  const shownError = fileError || error;

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        {label}
        {required && <span className="text-danger"> *</span>}
      </Form.Label>

      <div className="mb-2">
        <ButtonGroup size="sm" aria-label="Sumber gambar">
          <Button
            type="button"
            variant={mode === 'file' ? 'resto' : 'outline-resto'}
            onClick={() => setMode('file')}
          >
            Unggah file
          </Button>
          <Button
            type="button"
            variant={mode === 'url' ? 'resto' : 'outline-resto'}
            onClick={() => setMode('url')}
          >
            Tempel URL / path
          </Button>
        </ButtonGroup>
      </div>

      {mode === 'file' ? (
        <>
          <Form.Control
            key="input-file"
            type="file"
            accept="image/*"
            onChange={handleFile}
            isInvalid={Boolean(shownError)}
          />
          <Form.Text muted>
            JPG, PNG, atau WebP, maks. {MAX_IMAGE_MB} MB. Disimpan sementara di
            browser (simulasi).
          </Form.Text>
        </>
      ) : (
        <>
          <Form.Control
            key="input-url"
            type="text"
            inputMode="url"
            placeholder="https://contoh.com/foto.jpg atau /Gambar/foto.png"
            value={isDataUrl(value) ? '' : value || ''}
            onChange={(e) => {
              setFileError('');
              onChange(e.target.value);
            }}
            isInvalid={Boolean(shownError)}
          />
          <Form.Text muted>
            Path seperti <code>/Gambar/foto.png</code> merujuk ke folder{' '}
            <code>public</code>.
          </Form.Text>
        </>
      )}

      {shownError && <div className="invalid-feedback d-block">{shownError}</div>}

      {value && (
        <div className="image-input-preview">
          {broken ? (
            <div className="image-input-broken">
              Gambar tidak dapat dimuat. Periksa kembali URL / path-nya.
            </div>
          ) : (
            <img src={value} alt="Pratinjau gambar" onError={() => setBroken(true)} />
          )}
          <Button
            type="button"
            variant="link"
            size="sm"
            className="text-danger p-0 mt-1"
            onClick={() => onChange('')}
          >
            Hapus gambar
          </Button>
        </div>
      )}
    </Form.Group>
  );
}
