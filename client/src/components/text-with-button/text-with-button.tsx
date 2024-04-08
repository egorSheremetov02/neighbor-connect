import React from 'react'
import styles from './index.module.css'

export const TextWithButton = () => {
    return (
        <div className={styles.mainStyle}>
            <div>Some text</div>
            <button
                onClick={() => console.log('Example of application with node js')}>
                Here is a button
            </button>
        </div>
    )
}
