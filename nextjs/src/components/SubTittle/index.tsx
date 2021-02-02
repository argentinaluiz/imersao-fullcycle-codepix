import classes from './Subtitle.module.scss';

export const SubTitle: React.FunctionComponent = (props) => {
    return (
        <h2 className={classes.root}>
           {props.children} 
        </h2>
    );
};