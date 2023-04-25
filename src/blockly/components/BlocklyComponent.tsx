import React, { useEffect, useRef } from 'react'
import styles from '@/styles/BlocklyComponent.module.css'
import Blockly from 'blockly'
import { PropsWithChildren } from 'react'
import { QasmBlockly } from '@/generator/generatorCollection'



type BlocklyComponentProps = {
  trashcan: boolean
  media: string
  move: object
  setQASM: (qasm: string) => void
}

const BlocklyComponent = (props: PropsWithChildren<BlocklyComponentProps>) => {
  const blocklyDiv = useRef<HTMLInputElement | null>(null)
  const toolbox = useRef<HTMLInputElement | null>(null)
  const primaryWorkspace = useRef<Blockly.WorkspaceSvg | null>(null)
  const workspaceInjected = useRef(false)

  useEffect(() => {
    const { ...rest } = props

    if (blocklyDiv.current && toolbox.current && !workspaceInjected.current) {
      primaryWorkspace.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox.current,
        ...rest,
        grid: {
          length: 8,
          spacing: 40,
          snap: true,
        }
      })
      workspaceInjected.current = true

      primaryWorkspace.current.addChangeListener(() => {
        console.log('change occured!!!!');
        console.log(props.setQASM);

        const qasm = generateCode().qasm;

        props.setQASM(qasm + '');
      })
    }
  }, [primaryWorkspace, toolbox, blocklyDiv, props])

  // create an object that will store the parsed blockly blocks to a collection of qasm nodes

  // populate the collection with nodes
  const generateCode = () => {
    const collection = new QasmBlockly()
    console.log(collection.getBlocks())
    const compiled = collection.compile(primaryWorkspace.current);
    console.log(compiled);


    return compiled;
  }

  return (
    <>
      <div ref={blocklyDiv} className={styles.main} id='blocklyDiv' />
      <div ref={toolbox}>{props.children}</div>
    </>
  )
}
export default BlocklyComponent
