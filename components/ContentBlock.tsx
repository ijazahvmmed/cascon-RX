import styles from './ContentBlock.module.css';
import CharacterReveal from './CharacterReveal';

interface ContentBlockProps {
  title: string;
  children: React.ReactNode;
  id?: string;
}

export default function ContentBlock({ title, children, id }: ContentBlockProps) {
  return (
    <section className={styles.block} id={id}>
      <h2 className={styles.title}>
        <CharacterReveal text={title} />
      </h2>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
