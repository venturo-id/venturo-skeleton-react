import { useTranslate } from 'src/locales';
import { CONFIG } from 'src/shared/config';

import { SessionsView } from '../views/sessions-view';

// ----------------------------------------------------------------------

export default function Page() {
  const { t } = useTranslate('session');

  return (
    <>
      <title>{`${t('title')} - ${CONFIG.appName}`}</title>
      <SessionsView />
    </>
  );
}
