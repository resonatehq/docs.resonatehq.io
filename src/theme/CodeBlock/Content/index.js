import React from 'react';
import clsx from 'clsx';
import {useCodeBlockContext} from '@docusaurus/theme-common/internal';
import {useColorMode, usePrismTheme} from '@docusaurus/theme-common';
import {Highlight} from 'prism-react-renderer';
import Line from '@theme/CodeBlock/Line';
import styles from './styles.module.css';

const {themes} = require('prism-react-renderer');
const fallbackPrismThemes = {
  light: themes.vsLight,
  dark: themes.vsDark,
};
// TODO Docusaurus v4: remove useless forwardRef
const Pre = React.forwardRef((props, ref) => {
  return (
    <pre
      ref={ref}
      /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
      tabIndex={0}
      {...props}
      className={clsx(props.className, styles.codeBlock, 'thin-scrollbar')}
    />
  );
});
function Code(props) {
  const {metadata} = useCodeBlockContext();
  return (
    <code
      {...props}
      className={clsx(
        props.className,
        styles.codeBlockLines,
        metadata.lineNumbersStart !== undefined &&
          styles.codeBlockLinesWithNumbering,
      )}
      style={{
        ...props.style,
        counterReset:
          metadata.lineNumbersStart === undefined
            ? undefined
            : `line-count ${metadata.lineNumbersStart - 1}`,
      }}
    />
  );
}
export default function CodeBlockContent({className: classNameProp}) {
  const {metadata, wordWrap} = useCodeBlockContext();
  let colorMode = 'light';
  try {
    ({colorMode} = useColorMode());
  } catch (error) {
    if (!(error instanceof Error) || !/ColorModeProvider/.test(error.message)) {
      throw error;
    }
    if (
      typeof document !== 'undefined' &&
      document.documentElement.getAttribute('data-theme') === 'dark'
    ) {
      colorMode = 'dark';
    }
  }
  let prismTheme;
  try {
    prismTheme = usePrismTheme();
  } catch (error) {
    if (error instanceof Error && /ColorModeProvider/.test(error.message)) {
      prismTheme = fallbackPrismThemes[colorMode === 'dark' ? 'dark' : 'light'];
    } else {
      throw error;
    }
  }

  const {code, language, lineNumbersStart, lineClassNames} = metadata;
  return (
    <Highlight
      key={colorMode}
      theme={prismTheme}
      code={code}
      language={language}>
      {({className, style, tokens: lines, getLineProps, getTokenProps}) => (
        <Pre
          ref={wordWrap.codeBlockRef}
          className={clsx(classNameProp, className)}
          style={style}>
          <Code>
            {lines.map((line, i) => (
              <Line
                key={i}
                line={line}
                getLineProps={getLineProps}
                getTokenProps={getTokenProps}
                classNames={lineClassNames[i]}
                showLineNumbers={lineNumbersStart !== undefined}
              />
            ))}
          </Code>
        </Pre>
      )}
    </Highlight>
  );
}
