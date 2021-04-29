import BodyWrapper from '../components/BodyWrappper';
import List from '../components/List';
import RecordView from '../components/Recordview';
import PDFView from '../components/PDFview';
import NavBar from '../components/NavBar';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { useParams } from 'react-router-dom';

export default () => {
  return (
    <div style={{ display: 'block', height: '100%', width: '100%' }}>
      <NavBar />
      <BodyWrapper>
        <Router>
          <Switch>
            <Route
              path='/view/:id'
              component={() => <RecordView editable={false} addable={false} />}
            />
            <Route
              path='/edit/:id'
              component={() => <RecordView editable={true} addable={false} />}
            />
            <Route
              path='/add/'
              component={() => <RecordView editable={false} addable={true} />}
            />
            <Route path='/pdf/:id' component={() => <PDFView />} />
            <Route path='/'>
              <List></List>
            </Route>
          </Switch>
        </Router>
      </BodyWrapper>
    </div>
  );
};
