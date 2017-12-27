import styled from 'emotion/react'
import MaskedInput from 'react-text-mask'
import { css } from 'emotion'

function getRiskColor(risk) {
  if (risk === undefined)
    return '#999'

  if (risk < 0.8)
    return '#31b25b'

  if (risk < 1)
    return '#ff9900'

  return 'red'
}

export const AppRoot = styled('div')`
  background: ${p => getRiskColor(p.risk)};
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0
`

export const ConfigForm = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  flex-shrink: 0;
  
  @media screen and (max-width: 24em) {
    display: none
  }
`

export const FieldContainer = styled('div')`
  width: 100%;
  
  & label {
    text-transform: uppercase;
    font-size: 11px;
    color: white;
    display: block;
    margin-bottom: 5px;
  }

  &:not(:last-child) {
    margin-right: 5px
  }
`

export const fieldClass = css`
  width: 100%;
  padding: .3rem .4rem;
  outline: none;
  border: none;
  font-size: 16px;
  border-radius: 2px;
  background: rgba(0,0,0,.2);
  color: white;
  
  &::-webkit-input-placeholder  { color: rgba(255,255,255,.4) }
`

export const Field = styled('input')`
  composes: ${fieldClass}
`

export const MaskedField = styled(MaskedInput)`
  composes: ${fieldClass}
`

export const TimeFieldContainer = styled(FieldContainer)`
  width: 15%;
  flex-shrink: 0
`

export const TimeInfo = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 8vh;
  height: 100%;
  
  & h1 {
    font-size: 30vh;
    margin: 0
  }
`