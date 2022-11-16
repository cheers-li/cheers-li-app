import { List, ListProps } from '~/components/list/list';
import { ListItem } from '~/types/List';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { SpinnerLoader } from '~/components/loaders/spinner';

interface RefreshableListProps<T> extends ListProps<T> {
  reload: () => Promise<unknown>;
}

export const RefreshableList: React.FC<RefreshableListProps<ListItem>> = ({
  title,
  titleContent,
  loading,
  count,
  items,
  ItemComponent,
  reload,
  ...rest
}) => {
  return (
    <PullToRefresh
      onRefresh={reload}
      pullingContent={<></>}
      maxPullDownDistance={100}
      resistance={1.4}
      refreshingContent={<SpinnerLoader />}
    >
      <List
        title={title}
        titleContent={titleContent}
        loading={loading}
        items={items}
        count={count}
        ItemComponent={ItemComponent}
        {...rest}
      />
    </PullToRefresh>
  );
};
