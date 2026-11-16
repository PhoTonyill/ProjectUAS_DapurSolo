import { Link } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import Feedback from './Feedback.jsx';
import { useAdmin } from './admin/AdminContext.jsx';

export default function HomePage() {
  const { menus, about } = useAdmin();
  const storyParagraphs = about.story.split(/\n{2,}/).filter((p) => p.trim());
  const addressLines = about.address.split('\n');

  return (
    <>
      {/* SECTION HOME */}
      <section id="Home" className="split-section">
        <Row className="align-items-center g-4">
          <Col lg={5} className="split-left">
            <h2 className="hero-headline">Kuliner yang rasanya tidak ada lawannya</h2>
            <p className="hero-subheadline">
              Kami menyajikan berbagai macam kuliner khas Indonesia yang rasanya
              tidak ada lawannya. Nikmati pengalaman kuliner yang tak terlupakan
              di Restoran Pria Solo. Rekomendasi menu kami yang wajib dicoba
              adalah Lontong Solo, Selat Solo, dan Nasi Urap Solo. Setiap
              hidangan dibuat dengan bahan-bahan segar dan resep turun-temurun
              untuk memastikan cita rasa autentik yang memuaskan selera Anda.
            </p>
            <Button as={Link} to="/menu" className="btn-resto px-4">
              Lihat semua menu
            </Button>
          </Col>
          <Col lg={7}>
            <Row xs={1} sm={3} className="g-3">
              {menus.slice(0, 3).map((item) => (
                <Col key={item.id}>
                  <Card className="hero-panel h-100">
                    <div className="img-placeholder">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="panel-desc">{item.name}</div>
                    <Button
                      as={Link}
                      to={`/menu/${item.id}`}
                      variant="light"
                      className="panel-order-button"
                    >
                      Pesan sekarang
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </section>

      {/* SECTION CERITA */}
            <section id="Cerita" className="cerita-section">
              <h2>Cerita Kami</h2>
              <p className="cerita-subtitle">
                Kenali lebih dekat kisah di balik Restoran Pria Solo
              </p>
              <div className="cerita-container">
                {/* TENTANG RESTORAN */}
                <div className="cerita-row">
                  <div className="cerita-card">
                    <h3>Tentang Restoran Kami</h3>
                    {storyParagraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="cerita-side-image">
                    <img src="/ProjectUAS_DapurSolo/Gambar/Pria solo (2).jpg" alt="Sejarah Restoran" />
                  </div>
                </div>

                {/* MAKANAN TRADISIONAL */}
                <div className="cerita-row">
                  <div className="cerita-card">
                    <h3>Makanan Tradisional Khas Kami</h3>
                    <p>
                      Di Restoran Pria Solo, kami menghadirkan beragam hidangan
                      tradisional khas Solo dan Jawa yang diwariskan turun-temurun,
                      mulai dari Nasi Liwet Solo, Nasi Langgi, Selat Solo, Timlo
                      Solo, hingga Soto Ayam dan Rawon. Setiap hidangan dimasak
                      menggunakan resep asli keluarga tanpa mengurangi cita rasa
                      otentiknya.
                    </p>
                    <p>
                      Untuk melengkapi santapan, kami juga menyediakan aneka minuman
                      dan jajanan tradisional seperti Es Dawet, Wedang Ronde, Teh
                      Poci, Sosis Solo, dan Tempe Mendoan — semua diracik dengan
                      bahan segar dan resep turun-temurun.
                    </p>
                    <p>
                      Kami hanya menggunakan bahan-bahan segar dan berkualitas, mulai
                      dari santan kelapa asli, bumbu rempah pilihan, hingga daging
                      pilihan yang diolah dengan teknik memasak tradisional menggunakan
                      tungku kayu. Proses ini membutuhkan waktu lebih lama, namun
                      menghasilkan aroma dan rasa yang tidak bisa ditiru oleh cara
                      masak modern.
                    </p>
                    <p>
                      Bagi kami, menyajikan makanan tradisional bukan sekadar bisnis,
                      melainkan cara untuk melestarikan warisan kuliner Solo agar tetap
                      hidup dan dinikmati oleh generasi masa kini.
                    </p>
                  </div>
                </div>
              </div>
            </section>

      {/* SECTION KONTAK */}
            <section id="Kontak" className="contact-section">
              <h2>Kontak Kami</h2>
              <p className="contact-subtitle">
                Yuk, kunjungi dan ikuti media sosial Restoran Pria Solo untuk
              </p>
              <p className="contact-description">RASA YANG SUSAH DILAWAN!</p>

              <div className="contact-container">
                {/* ALAMAT */}
                <Card className="contact-card">
                  <h3>📍 Alamat</h3>
                  <p>
                    {addressLines.map((line, index) => (
                      <span key={index}>
                        {index > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </p>
                </Card>

                {/* INSTAGRAM */}
                {about.instagram && (
                  <Card className="contact-card">
                    <h3>📷 Instagram</h3>
                    <p>
                      <a
                        href={`https://instagram.com/${about.instagram}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        @{about.instagram}
                      </a>
                    </p>
                  </Card>
                )}

                {/* TIKTOK */}
                {about.tiktok && (
                  <Card className="contact-card">
                    <h3>🎵 TikTok</h3>
                    <p>
                      <a
                        href={`https://tiktok.com/@${about.tiktok}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        @{about.tiktok}
                      </a>
                    </p>
                  </Card>
                )}

                {/* TELEPON (tampil jika diisi di dashboard admin) */}
                {about.phone && (
                  <Card className="contact-card">
                    <h3>📞 Telepon</h3>
                    <p>{about.phone}</p>
                  </Card>
                )}

                {/* EMAIL (tampil jika diisi di dashboard admin) */}
                {about.email && (
                  <Card className="contact-card">
                    <h3>✉️ Email</h3>
                    <p>
                      <a href={`mailto:${about.email}`}>{about.email}</a>
                    </p>
                  </Card>
                )}
              </div>

              {/* GOOGLE MAPS */}
              <div className="map-container">
                <h3>Lokasi Kami</h3>
                <iframe
                  src="https://www.google.com/maps?q=Universitas+Tarumanagara+Kampus+1,+Jl.+Letjen+S.+Parman+No.+1,+Jakarta+Barat&output=embed"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Google Maps Location"
                ></iframe>
              </div>

              {/* FORM MASUKAN LAYANAN */}
              <Feedback />
            </section>
    </>
  );
}
