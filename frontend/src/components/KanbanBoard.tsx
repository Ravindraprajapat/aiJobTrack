import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { updateApplication } from "../redux/applicationSlice";
import Column from "./Column";

const columns = [
  "Applied",
  "Phone Screen",
  "Interview",
  "Offer",
  "Rejected",
];

interface Props {
  applications: any[];
}

const KanbanBoard = ({ applications }: Props) => {
  const dispatch = useDispatch();

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as any;
    const application = applications.find((app) => app._id === draggableId);

    if (application && application.status !== newStatus) {
      // Optimistic update
      const updatedApp = { ...application, status: newStatus };
      dispatch(updateApplication(updatedApp));

      try {
        await axios.patch(
          `${serverUrl}/api/application/${draggableId}`,
          { status: newStatus },
          { withCredentials: true }
        );
      } catch (error) {
        console.log("Drag & Drop update failed", error);
        // Rollback
        dispatch(updateApplication(application));
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid md:grid-cols-5 gap-4">
        {columns.map((col) => (
          <Column
            key={col}
            title={col}
            applications={applications}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;