import React from "react";

interface EmojiProps {
    mr?: number;
}

const Emoji: React.FC<EmojiProps> = ({ mr, children }) => {
    return (
        <span role="img" style={{ marginRight: mr ? mr.toString() + "px" : "" }}>
            {children}
        </span>
    );
};

export default Emoji;
