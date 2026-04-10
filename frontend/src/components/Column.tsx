import { Droppable } from "@hello-pangea/dnd";
import Card from "./Card";

interface Props {
  title: string;
  applications: any[];
}

const Column = ({ title, applications = [] }: Props) => {
  const safeApps = Array.isArray(applications) ? applications : [];
  const filtered = safeApps.filter((a) => a.status === title);

  return (
    <Droppable droppableId={title}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-xl min-h-[400px] flex flex-col border border-slate-200 dark:border-transparent transition-colors"
        >
          <h2 className="mb-4 font-semibold text-slate-800 dark:text-white">{title}</h2>

          <div className="flex-1">
            {filtered.map((app, index) => (
              <Card key={app._id} app={app} index={index} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default Column;