
interface ModuleListHeaderProps {
  title: string;
}

const ModuleListHeader = ({ title }: ModuleListHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-medium">{title}</h2>
    </div>
  );
};

export default ModuleListHeader;
