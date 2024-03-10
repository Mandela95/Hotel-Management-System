import { useParams } from "react-router-dom";

export default function RoomDetails() {
  const { id } = useParams<{ id: string }>();
  console.log(id);
  return <div>RoomDetails</div>;
}
