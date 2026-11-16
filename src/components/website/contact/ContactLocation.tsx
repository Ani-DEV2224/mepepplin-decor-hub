
import { ArrowUpRight, MapPin } from "lucide-react";

const address =
  "Uyo Street, Rumuomasi, Port Harcourt, Rivers State, Nigeria";

const mapQuery = encodeURIComponent(address);

export default function ContactLocation() {
  return (
    <section
      className="mdh-cp-section mdh-cp-location"
      id="visit-us"
    >
      <div className="mdh-cp-container">
        <div className="mdh-cp-section-label">
          <span>02 / OUR LOCATION</span>
          <span>FIND US</span>
        </div>

        <div className="mdh-cp-location-heading">
          <div>
            <span className="mdh-cp-eyebrow">
              OUR STUDIO
            </span>

            <h2>
              Find us in
              <br />
              <em>Port Harcourt.</em>
            </h2>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mdh-cp-map-link"
          >
            OPEN GOOGLE MAPS
            <ArrowUpRight size={18} />
          </a>
        </div>

        <div className="mdh-cp-map-frame">
          <iframe
            title="Map showing Uyo Street, Rumuomasi, Port Harcourt"
            src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <div className="mdh-cp-map-caption">
          <MapPin size={18} />

          <span>{address}</span>
        </div>
      </div>
    </section>
  );
}
