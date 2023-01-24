import React from 'react';

interface Props {
  text: string;
}

const LinkifiedText = (props: Props) => {
  // use whatever you want here
  const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

  return <>{props.text
    .split(" ")
    .map(part =>
      URL_REGEX.test(part) ? <a key={part} href={part}>{part} </a> : part + " "
    )}
    </>;
}

export default LinkifiedText;
