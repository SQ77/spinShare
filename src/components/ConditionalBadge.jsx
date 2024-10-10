const ConditionalBadge = ({ condition, wrapper, children }) =>
    condition ? wrapper(children) : children;

export default ConditionalBadge;
