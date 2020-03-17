import React, { FC, HTMLAttributes } from "react";
import { Rocket } from "../../store/rockets/types";
import styled from "styled-components";

interface RocketRowProps extends HTMLAttributes<HTMLTableRowElement> {
  rocket: Rocket;
}

const StyledLink = styled.a`
  color: #0052ab;
`;

export const RocketRow: FC<RocketRowProps> = ({ rocket }) => (
  <tr>
    <td>
      <StyledLink href={rocket.wikiURL?.href}>{rocket.name}</StyledLink>
    </td>
    <td>{rocket.configuration}</td>
    <td>{rocket.changed.toLocaleDateString()}</td>
  </tr>
);
