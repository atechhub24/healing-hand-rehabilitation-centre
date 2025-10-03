import { Card } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Map, MapPin } from "lucide-react";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapMarker {
  id: string;
  position: [number, number];
  popup: string;
  type: string;
}

interface AttendanceMapProps {
  mapMarkers: MapMarker[];
}

export default function AttendanceMap({ mapMarkers }: AttendanceMapProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Staff Locations
        </h3>
        <p className="text-sm text-muted-foreground">
          {mapMarkers.length} location{mapMarkers.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {mapMarkers.length > 0 ? (
        <div className="bg-muted rounded-lg overflow-hidden h-[500px]">
          <MapContainer
            center={[20, 0] as [number, number]}
            zoom={2}
            style={{ height: "100%", width: "100%" }}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {mapMarkers.map((marker) => (
              <Marker key={marker.id} position={marker.position}>
                <Popup>{marker.popup}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        <div className="text-center py-12">
          <Map className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h4 className="text-lg font-medium mb-2">
            No Location Data Available
          </h4>
          <p className="text-muted-foreground mb-4">
            No staff location data found for the selected date range
          </p>
        </div>
      )}
    </Card>
  );
}
