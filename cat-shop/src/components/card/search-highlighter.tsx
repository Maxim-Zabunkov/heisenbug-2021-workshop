import { createStyles, makeStyles } from "@material-ui/core";
import { yellow } from "@material-ui/core/colors";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../contracts/app-state.contracts";

const useStyle = makeStyles(() =>
    createStyles({
        highlighted: {
            backgroundColor: yellow[500]
        }
    })
);

export function SearchHighlighter(props: { text: string }): JSX.Element | null {
    const { text } = props;
    const classes = useStyle();
    const search = useSelector((x: AppState) => x.search?.pattern);
    if (!search)
        return <>{text}</>;
    const parts = splitText(text, search);
    return (
        <>
            {parts.map((p, i) => <span key={i} className={p.highlight ? classes.highlighted : undefined}>{p.text}</span>)}
        </>
    );
}

export function splitText(original: string, search: string): { text: string; highlight?: true }[] {
    const parts = original.split(new RegExp(search, 'i'));
    let lastIndex = 0;
    return parts.flatMap((text, i, a) => {
        const item = { text };
        lastIndex += text.length;
        if (i < a.length - 1) {
            const highlight = { text: original.substr(lastIndex, search.length), highlight: true }
            lastIndex += search.length;
            return [item, highlight];
        }
        return [{ text }];
    });
}