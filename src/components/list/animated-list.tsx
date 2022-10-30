import { List, ListProps } from '~/components/list/list';
import { ListItem } from '~/types/List';
import PullToRefresh from 'react-simple-pull-to-refresh';

interface AnimatedListProps<T> extends ListProps<T> {
  reload: () => Promise<unknown>;
}

export const AnimatedList: React.FC<AnimatedListProps<ListItem>> = ({
  title,
  titleContent,
  loading,
  count,
  items,
  ItemComponent,
  reload,
  horizontalPadding,
}) => {
  return (
    <PullToRefresh
      onRefresh={reload}
      pullingContent={<></>}
      maxPullDownDistance={100}
      resistance={1.4}
    >
      <List
        title={title}
        titleContent={titleContent}
        loading={loading}
        items={items}
        count={count}
        ItemComponent={ItemComponent}
        horizontalPadding={horizontalPadding}
      />
    </PullToRefresh>
  );
};
