import clsx from "clsx";

const Card: React.FC<React.AllHTMLAttributes<HTMLDivElement>> = ({
    className,
    ...props
  }) => {
    return (
      <div
        className={clsx('p-4 bg-light rounded-lg', className)}
        {...props}
      />
    );
  };
  
  export default Card;