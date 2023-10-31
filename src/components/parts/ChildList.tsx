import React from 'react'
import {Context, getUrl, queryGuillotineWithPath, VariablesGetterResult} from '@enonic/nextjs-adapter';
import {PartProps} from '@enonic/nextjs-adapter/views/BasePart';

const ChildList = (props: PartProps) => {
    const {data, meta} = props;
    const children = data.get.children;
    if (!children || children.length === 0) {
        return null;
    }
    return (
        <main style={{
            margin: `0 auto`,
            maxWidth: 960,
            padding: `0 1.0875rem`,
        }}>
            {
                children &&
                <ul>{
                    children.map((child: any, i: number) => (
                        <li key={i}>
                            <a href={getUrl(child.pageUrl, meta)}>
                                {child.displayName}
                            </a>
                        </li>
                    ))
                }</ul>
            }
        </main>
    );
};

export default ChildList;

export const getChildList = {
    query: function (path: string, context?: Context, config?: any): string {
        return queryGuillotineWithPath(`getSite {
                  displayName
                }
                get(key:$path) {
                  displayName
                  children(sort: $order) {
                      pageUrl
                      displayName
                  }
                }`, {
            '$order': 'String'
        })
    },
    variables: function (path: string, context?: Context, config?: any): VariablesGetterResult {
        return {
            order: config?.sorting,
        }
    }
};

export async function childListProcessor(common: any, context?: Context, config?: any): Promise<any> {
    common.modifiedBy = 'childListProcessor';
    return common;
}
