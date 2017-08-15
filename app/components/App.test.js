import * as React from 'react'
import { shallow } from 'enzyme'
import App from './App'

describe('<App />', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(<App />);
    expect(wrapper).to.matchSnapshot()
  });
})
