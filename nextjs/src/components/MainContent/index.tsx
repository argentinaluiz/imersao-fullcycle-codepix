import classes from "./MainContent.module.scss";
export const MainContent: React.FunctionComponent = (props) => {
  return (
    <main className={classes.root}>
      <div className="container">{props.children}</div>
    </main>
  );
};

export default MainContent;
